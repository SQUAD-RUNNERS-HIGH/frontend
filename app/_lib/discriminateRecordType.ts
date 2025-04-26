import {competitorRunningRecord, soloRunningRecord}from '@/app/_types';
export function isCompetitorRunningRecord(
  record: competitorRunningRecord | soloRunningRecord
): record is competitorRunningRecord {
  return 'progress' in record && 'courseId' in record;
}

export function isSoloRunningRecord(
  record: competitorRunningRecord | soloRunningRecord
): record is soloRunningRecord {
  return 'coordinates' in record && 'courseName' in record;
}