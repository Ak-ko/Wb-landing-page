<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait HasDuplicateFunctionality
{
    /**
     * Duplicate a record with all its relationships
     *
     * @param Request $request
     * @param string $modelClass The model class to duplicate
     * @param array $fillableFields Fields to copy from the original record
     * @param array $relationships Relationships to duplicate (nested arrays supported)
     * @param callable|null $customDuplicateLogic Custom logic to run after duplication
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function duplicateRecord(
        Request $request,
        string $modelClass,
        array $fillableFields = ['title', 'description'],
        array $relationships = [],
        ?callable $customDuplicateLogic = null
    ) {
        $request->validate([
            'id' => 'required|integer|exists:' . (new $modelClass)->getTable() . ',id',
        ]);

        $originalRecord = $modelClass::with($relationships)->findOrFail($request->id);

        $duplicatedRecord = DB::transaction(function () use ($originalRecord, $fillableFields, $relationships, $customDuplicateLogic) {
            // Prepare data for the new record
            $duplicateData = [];
            foreach ($fillableFields as $field) {
                if (isset($originalRecord->$field)) {
                    $duplicateData[$field] = $originalRecord->$field;
                }
            }

            // Add "(Copy)" to title if it exists
            if (isset($duplicateData['title'])) {
                $duplicateData['title'] = $duplicateData['title'] . ' (Copy)';
            }

            // Create the duplicated record
            $duplicatedRecord = $originalRecord->getModel()::create($duplicateData);

            // Duplicate relationships
            $this->duplicateRelationships($originalRecord, $duplicatedRecord, $relationships);

            // Run custom logic if provided
            if ($customDuplicateLogic) {
                $customDuplicateLogic($originalRecord, $duplicatedRecord);
            }

            return $duplicatedRecord;
        });

        return back()->with('duplicated_id', $duplicatedRecord->id);
    }

    /**
     * Recursively duplicate relationships
     *
     * @param mixed $originalRecord
     * @param mixed $duplicatedRecord
     * @param array $relationships
     * @return void
     */
    private function duplicateRelationships($originalRecord, $duplicatedRecord, array $relationships): void
    {
        foreach ($relationships as $relationship => $nestedRelationships) {
            if (is_string($nestedRelationships)) {
                // Simple relationship
                $this->duplicateSimpleRelationship($originalRecord, $duplicatedRecord, $nestedRelationships);
            } elseif (is_array($nestedRelationships)) {
                // Nested relationship
                $this->duplicateNestedRelationship($originalRecord, $duplicatedRecord, $relationship, $nestedRelationships);
            }
        }
    }

    /**
     * Duplicate a simple relationship
     *
     * @param mixed $originalRecord
     * @param mixed $duplicatedRecord
     * @param string $relationshipName
     * @return void
     */
    private function duplicateSimpleRelationship($originalRecord, $duplicatedRecord, string $relationshipName): void
    {
        if ($originalRecord->$relationshipName) {
            // Check if this is a collection (hasMany) or single model (belongsTo)
            if ($originalRecord->$relationshipName instanceof \Illuminate\Database\Eloquent\Collection) {
                // Handle hasMany relationships
                foreach ($originalRecord->$relationshipName as $relatedRecord) {
                    $relatedData = $relatedRecord->toArray();

                    // Remove the ID and timestamps
                    unset($relatedData['id']);
                    unset($relatedData['created_at']);
                    unset($relatedData['updated_at']);

                    // Get the foreign key for the relationship
                    $foreignKey = $duplicatedRecord->$relationshipName()->getForeignKeyName();
                    unset($relatedData[$foreignKey]);

                    // Create the duplicated relationship
                    $duplicatedRecord->$relationshipName()->create($relatedData);
                }
            } else {
                // Handle belongsTo relationships
                $relationshipData = $originalRecord->$relationshipName->toArray();

                // Remove the ID and foreign key
                unset($relationshipData['id']);
                $foreignKey = $duplicatedRecord->getForeignKey();
                unset($relationshipData[$foreignKey]);

                // Create the duplicated relationship
                $duplicatedRecord->$relationshipName()->create($relationshipData);
            }
        }
    }

    /**
     * Duplicate a nested relationship (hasMany relationships)
     *
     * @param mixed $originalRecord
     * @param mixed $duplicatedRecord
     * @param string $relationshipName
     * @param array $nestedRelationships
     * @return void
     */
    private function duplicateNestedRelationship($originalRecord, $duplicatedRecord, string $relationshipName, array $nestedRelationships): void
    {
        if ($originalRecord->$relationshipName && $originalRecord->$relationshipName->count() > 0) {
            foreach ($originalRecord->$relationshipName as $relatedRecord) {
                $relatedData = $relatedRecord->toArray();

                // Remove the ID and foreign key
                unset($relatedData['id']);
                unset($relatedData['created_at']);
                unset($relatedData['updated_at']);

                // Get the foreign key for the relationship
                $foreignKey = $duplicatedRecord->$relationshipName()->getForeignKeyName();
                unset($relatedData[$foreignKey]);

                // Create the duplicated related record
                $duplicatedRelatedRecord = $duplicatedRecord->$relationshipName()->create($relatedData);

                // Recursively duplicate nested relationships
                foreach ($nestedRelationships as $nestedRelationship => $nestedNestedRelationships) {
                    if (is_string($nestedNestedRelationships)) {
                        // Simple nested relationship
                        $this->duplicateSimpleRelationship($relatedRecord, $duplicatedRelatedRecord, $nestedNestedRelationships);
                    } elseif (is_array($nestedNestedRelationships)) {
                        // Further nested relationship
                        $this->duplicateNestedRelationship($relatedRecord, $duplicatedRelatedRecord, $nestedRelationship, $nestedNestedRelationships);
                    }
                }
            }
        }
    }
}
