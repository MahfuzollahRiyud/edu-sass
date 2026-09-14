<?php

namespace App\Services;

use App\Models\AcademicClass;
use App\Models\ClassSubject;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;

class CurriculumPresetService
{
    /**
     * Master catalog of standard NCTB secondary subjects.
     */
    public function getSubjectCatalog(): array
    {
        return [
            // Languages (1st and 2nd papers)
            'bangla_1st' => [
                'name' => 'Bangla 1st Paper',
                'code' => 'BAN-101',
            ],
            'bangla_2nd' => [
                'name' => 'Bangla 2nd Paper',
                'code' => 'BAN-102',
            ],
            'english_1st' => [
                'name' => 'English 1st Paper',
                'code' => 'ENG-101',
            ],
            'english_2nd' => [
                'name' => 'English 2nd Paper',
                'code' => 'ENG-102',
            ],

            // General Junior Core
            'math_junior' => [
                'name' => 'Mathematics',
                'code' => 'MATH-101',
            ],
            'general_science' => [
                'name' => 'General Science',
                'code' => 'SCI-101',
            ],
            'bgs' => [
                'name' => 'Bangladesh & Global Studies',
                'code' => 'BGS-101',
            ],
            'ict' => [
                'name' => 'Information & Communication Technology',
                'code' => 'ICT-101',
            ],
            'religion' => [
                'name' => 'Religion & Moral Education',
                'code' => 'REL-101',
            ],

            // SSC Core (Class 9 & 10)
            'general_math' => [
                'name' => 'General Mathematics',
                'code' => 'GMATH-101',
            ],

            // Science Group (Class 9 & 10)
            'physics' => [
                'name' => 'Physics',
                'code' => 'PHY-101',
            ],
            'chemistry' => [
                'name' => 'Chemistry',
                'code' => 'CHEM-101',
            ],
            'biology' => [
                'name' => 'Biology',
                'code' => 'BIO-101',
            ],
            'higher_math' => [
                'name' => 'Higher Mathematics',
                'code' => 'HMATH-101',
            ],

            // Business Studies Group (Class 9 & 10)
            'accounting' => [
                'name' => 'Accounting',
                'code' => 'ACC-101',
            ],
            'business_ent' => [
                'name' => 'Business Entrepreneurship',
                'code' => 'BENT-101',
            ],
            'finance_banking' => [
                'name' => 'Finance & Banking',
                'code' => 'FIN-101',
            ],

            // Humanities / Arts Group (Class 9 & 10)
            'history' => [
                'name' => 'History of Bangladesh & World Civilization',
                'code' => 'HIST-101',
            ],
            'geography' => [
                'name' => 'Geography & Environment',
                'code' => 'GEO-101',
            ],
            'civics' => [
                'name' => 'Civics & Citizenship',
                'code' => 'CIV-101',
            ],
            'economics' => [
                'name' => 'Economics',
                'code' => 'ECON-101',
            ],
        ];
    }

    /**
     * Preset class and group configurations.
     */
    public function getAvailablePresets(): array
    {
        $juniorSubjects = [
            'bangla_1st',
            'bangla_2nd',
            'english_1st',
            'english_2nd',
            'math_junior',
            'general_science',
            'bgs',
            'ict',
            'religion',
        ];

        $sscCompulsory = [
            'bangla_1st',
            'bangla_2nd',
            'english_1st',
            'english_2nd',
            'general_math',
            'ict',
            'religion',
        ];

        return [
            // Junior Level (Class 6 - 8)
            'class_6_general' => [
                'category' => 'Junior Level (Classes 6-8)',
                'name' => 'Class 6',
                'section' => 'General',
                'sort_order' => 1,
                'subjects' => $juniorSubjects,
                'description' => 'General curriculum with 9 subjects (Bangla 1st & 2nd, English 1st & 2nd, Math, Science, BGS, ICT, Religion)',
            ],
            'class_7_general' => [
                'category' => 'Junior Level (Classes 6-8)',
                'name' => 'Class 7',
                'section' => 'General',
                'sort_order' => 2,
                'subjects' => $juniorSubjects,
                'description' => 'General curriculum with 9 subjects',
            ],
            'class_8_general' => [
                'category' => 'Junior Level (Classes 6-8)',
                'name' => 'Class 8',
                'section' => 'General',
                'sort_order' => 3,
                'subjects' => $juniorSubjects,
                'description' => 'General curriculum with 9 subjects',
            ],

            // Secondary Level (Class 9)
            'class_9_science' => [
                'category' => 'Class 9 (SSC)',
                'name' => 'Class 9',
                'section' => 'Science',
                'sort_order' => 4,
                'subjects' => array_merge($sscCompulsory, ['bgs', 'physics', 'chemistry', 'biology', 'higher_math']),
                'description' => 'Science group with 12 subjects including Physics, Chemistry, Biology & Higher Math',
            ],
            'class_9_business' => [
                'category' => 'Class 9 (SSC)',
                'name' => 'Class 9',
                'section' => 'Business Studies',
                'sort_order' => 5,
                'subjects' => array_merge($sscCompulsory, ['general_science', 'accounting', 'business_ent', 'finance_banking']),
                'description' => 'Commerce group with 11 subjects including Accounting, Business Ent., Finance & Banking',
            ],
            'class_9_humanities' => [
                'category' => 'Class 9 (SSC)',
                'name' => 'Class 9',
                'section' => 'Humanities',
                'sort_order' => 6,
                'subjects' => array_merge($sscCompulsory, ['general_science', 'history', 'geography', 'civics', 'economics']),
                'description' => 'Arts group with 12 subjects including History, Geography, Civics & Economics',
            ],

            // Secondary Level (Class 10)
            'class_10_science' => [
                'category' => 'Class 10 (SSC)',
                'name' => 'Class 10',
                'section' => 'Science',
                'sort_order' => 7,
                'subjects' => array_merge($sscCompulsory, ['bgs', 'physics', 'chemistry', 'biology', 'higher_math']),
                'description' => 'Science group with 12 subjects including Physics, Chemistry, Biology & Higher Math',
            ],
            'class_10_business' => [
                'category' => 'Class 10 (SSC)',
                'name' => 'Class 10',
                'section' => 'Business Studies',
                'sort_order' => 8,
                'subjects' => array_merge($sscCompulsory, ['general_science', 'accounting', 'business_ent', 'finance_banking']),
                'description' => 'Commerce group with 11 subjects including Accounting, Business Ent., Finance & Banking',
            ],
            'class_10_humanities' => [
                'category' => 'Class 10 (SSC)',
                'name' => 'Class 10',
                'section' => 'Humanities',
                'sort_order' => 9,
                'subjects' => array_merge($sscCompulsory, ['general_science', 'history', 'geography', 'civics', 'economics']),
                'description' => 'Arts group with 12 subjects including History, Geography, Civics & Economics',
            ],
        ];
    }

    /**
     * Import selected curriculum presets into a tenant.
     *
     * @param int $tenantId
     * @param array $selectedKeys Array of preset keys (e.g. ['class_9_science', 'class_10_science'])
     * @return array Summary of import statistics
     */
    public function import(int $tenantId, array $selectedKeys): array
    {
        $allPresets = $this->getAvailablePresets();
        $catalog = $this->getSubjectCatalog();

        $classesCreated = 0;
        $subjectsCreated = 0;
        $mappingsCreated = 0;
        $classesProcessed = 0;

        DB::transaction(function () use (
            $tenantId,
            $selectedKeys,
            $allPresets,
            $catalog,
            &$classesCreated,
            &$subjectsCreated,
            &$mappingsCreated,
            &$classesProcessed
        ) {
            foreach ($selectedKeys as $key) {
                if (! isset($allPresets[$key])) {
                    continue;
                }

                $preset = $allPresets[$key];
                $classesProcessed++;

                // 1. Find or create the AcademicClass (safely handle soft deletes)
                $academicClass = AcademicClass::withTrashed()
                    ->where('tenant_id', $tenantId)
                    ->where('name', $preset['name'])
                    ->where('section', $preset['section'])
                    ->first();

                if ($academicClass) {
                    if ($academicClass->trashed()) {
                        $academicClass->restore();
                    }
                    $academicClass->update([
                        'is_active' => true,
                        'sort_order' => $preset['sort_order'],
                    ]);
                } else {
                    $academicClass = AcademicClass::create([
                        'tenant_id' => $tenantId,
                        'name' => $preset['name'],
                        'section' => $preset['section'],
                        'sort_order' => $preset['sort_order'],
                        'is_active' => true,
                    ]);
                    $classesCreated++;
                }

                // 2. Iterate through required subjects
                foreach ($preset['subjects'] as $subjectKey) {
                    if (! isset($catalog[$subjectKey])) {
                        continue;
                    }

                    $subjectData = $catalog[$subjectKey];

                    // Find or create subject (tenant scoped, handle soft deletes)
                    $subject = Subject::withTrashed()
                        ->where('tenant_id', $tenantId)
                        ->where('name', $subjectData['name'])
                        ->first();

                    if ($subject) {
                        if ($subject->trashed()) {
                            $subject->restore();
                        }
                        $subject->update(['is_active' => true]);
                    } else {
                        $subject = Subject::create([
                            'tenant_id' => $tenantId,
                            'name' => $subjectData['name'],
                            'code' => $subjectData['code'],
                            'is_active' => true,
                        ]);
                        $subjectsCreated++;
                    }

                    // 3. Link subject to class
                    $classSubject = ClassSubject::firstOrCreate(
                        [
                            'tenant_id' => $tenantId,
                            'academic_class_id' => $academicClass->id,
                            'subject_id' => $subject->id,
                        ],
                        [
                            'monthly_fee' => 0.00,
                        ]
                    );

                    if ($classSubject->wasRecentlyCreated) {
                        $mappingsCreated++;
                    }
                }
            }
        });

        return [
            'classes_processed' => $classesProcessed,
            'classes_created' => $classesCreated,
            'subjects_created' => $subjectsCreated,
            'mappings_created' => $mappingsCreated,
        ];
    }
}
