import { useState } from 'react';
import { router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export type PresetItem = {
    category: string;
    name: string;
    section: string;
    sort_order: number;
    subjects: string[];
    description: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    presets: Record<string, PresetItem>;
};

export default function ImportCurriculumDialog({
    open,
    onOpenChange,
    presets,
}: Props) {
    const allKeys = Object.keys(presets);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(allKeys);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Group presets by category
    const categories = Array.from(new Set(Object.values(presets).map((p) => p.category)));

    const toggleKey = (key: string) => {
        setSelectedKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const toggleGroup = (groupKeys: string[]) => {
        const allInGroupSelected = groupKeys.every((k) => selectedKeys.includes(k));
        if (allInGroupSelected) {
            setSelectedKeys((prev) => prev.filter((k) => !groupKeys.includes(k)));
        } else {
            setSelectedKeys((prev) => Array.from(new Set([...prev, ...groupKeys])));
        }
    };

    const handleSelectAll = () => setSelectedKeys(allKeys);
    const handleDeselectAll = () => setSelectedKeys([]);

    const handleSubmit = () => {
        if (selectedKeys.length === 0) return;

        setIsSubmitting(true);
        router.post(
            '/admin/classes/import-curriculum',
            { selected_classes: selectedKeys },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onOpenChange(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] sm:max-w-2xl flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                        <Sparkles className="h-4 w-4" />
                        1-Click Curriculum Setup
                    </div>
                    <DialogTitle className="text-xl font-bold mt-1">
                        Import Bangladeshi Curriculum (Class 6 – 10)
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                        Automatically generates standard NCTB classes, sections, and subjects including Bangla 1st &amp; 2nd, English 1st &amp; 2nd, General Math, and stream subjects. Existing items will not be duplicated.
                    </DialogDescription>

                    <div className="flex items-center justify-between pt-3 text-xs">
                        <span className="font-medium text-foreground">
                            {selectedKeys.length} of {allKeys.length} classes selected
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-primary hover:underline font-medium"
                            >
                                Select All
                            </button>
                            <span className="text-muted-foreground">•</span>
                            <button
                                type="button"
                                onClick={handleDeselectAll}
                                className="text-muted-foreground hover:text-foreground font-medium"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {categories.map((category) => {
                        const categoryPresets = Object.entries(presets).filter(
                            ([, item]) => item.category === category
                        );
                        const groupKeys = categoryPresets.map(([key]) => key);
                        const allGroupSelected = groupKeys.every((k) =>
                            selectedKeys.includes(k)
                        );

                        return (
                            <div key={category} className="space-y-3">
                                <div className="flex items-center justify-between pb-1 border-b">
                                    <h4 className="text-sm font-semibold text-foreground">
                                        {category}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(groupKeys)}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {allGroupSelected ? 'Deselect Group' : 'Select Group'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {categoryPresets.map(([key, item]) => {
                                        const isSelected = selectedKeys.includes(key);

                                        return (
                                            <div
                                                key={key}
                                                onClick={() => toggleKey(key)}
                                                className={`cursor-pointer relative flex flex-col justify-between p-3.5 rounded-lg border text-left transition-all ${
                                                    isSelected
                                                        ? 'border-primary/60 bg-primary/5 ring-1 ring-primary/40'
                                                        : 'border-border/70 hover:border-border hover:bg-muted/30'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div>
                                                        <div className="font-semibold text-sm text-foreground">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-primary font-medium">
                                                            {item.section}
                                                        </div>
                                                    </div>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleKey(key)}
                                                        className="mt-0.5"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="mt-auto pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="h-3 w-3" />
                                                        {item.subjects.length} Subjects
                                                    </span>
                                                    {isSelected && (
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <DialogFooter className="p-4 sm:p-6 border-t bg-muted/20 flex flex-row items-center justify-between">
                    <div className="text-xs text-muted-foreground hidden sm:block">
                        Ready to generate classes, sections &amp; link subjects.
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || selectedKeys.length === 0}
                            className="gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Import {selectedKeys.length} Classes
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
