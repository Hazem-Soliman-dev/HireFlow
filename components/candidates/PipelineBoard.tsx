"use client";

import { useMemo, useState, useTransition, useId, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Candidate, Stage, Interview } from "@prisma/client";
import { updateCandidateStage } from "@/app/actions/candidates";
import CandidateCard from "@/components/candidates/CandidateCard";
import CandidateDrawer from "@/components/candidates/CandidateDrawer";
import { stageOrder } from "@/lib/roles";

type CandidateWithInterviews = Candidate & { interviews: Interview[] };

function DraggableCandidate({
  candidate,
  onClick
}: {
  candidate: CandidateWithInterviews;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: candidate.id,
      data: { stage: candidate.stage }
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-40" : ""}
    >
      <CandidateCard candidate={candidate} isDraggable onClick={onClick} />
    </div>
  );
}

function DroppableColumn({
  stage,
  label,
  tone,
  count,
  children
}: {
  stage: Stage;
  label: string;
  tone: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-[520px] w-72 shrink-0 flex-col gap-4.5 rounded-2xl border p-4.5 transition-all duration-300 ${
        isOver 
          ? "border-indigo-400 ring-4 ring-indigo-500/5 bg-indigo-50/20" 
          : "border-slate-200/60 bg-slate-50/20 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.005)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className={`rounded-lg px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${tone} border border-current/10 shadow-sm`}>
          {label}
        </span>
        <span className="rounded-lg bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-slate-500 border border-slate-150 shadow-sm">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-1">{children}</div>
    </div>
  );
}

export default function PipelineBoard({
  initialCandidates
}: {
  initialCandidates: CandidateWithInterviews[];
}) {
  const [candidates, setCandidates] = useState(initialCandidates);

  useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const dndId = useId();
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

  const activeCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === activeId) ?? null,
    [activeId, candidates]
  );

  const drawerCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null,
    [selectedCandidateId, candidates]
  );

  const handleStageUpdated = (candidateId: string, stage: Stage) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, stage }
          : c
      )
    );
  };

  return (
    <>
      <DndContext
        id={dndId}
        sensors={sensors}
        onDragStart={({ active }) => {
          setActiveId(active.id.toString());
        }}
        onDragEnd={({ active, over }) => {
          setActiveId(null);
          if (!over) return;
          const targetStage = over.id as Stage;
          const candidateId = active.id.toString();
          const current = candidates.find((c) => c.id === candidateId);
          if (!current || current.stage === targetStage) return;

          setCandidates((prev) =>
            prev.map((candidate) =>
              candidate.id === candidateId
                ? { ...candidate, stage: targetStage }
                : candidate
            )
          );

          startTransition(async () => {
            try {
              await updateCandidateStage(candidateId, targetStage);
            } catch (err) {
              // Rollback optimistic update on error
              setCandidates((prev) =>
                prev.map((candidate) =>
                  candidate.id === candidateId
                    ? { ...candidate, stage: current.stage }
                    : candidate
                )
              );
              alert(err instanceof Error ? err.message : "Failed to update stage.");
            }
          });
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 pb-2">
            {stageOrder.map((stage) => {
              const colCandidates = candidates.filter((candidate) => candidate.stage === stage.key);
              return (
                <DroppableColumn
                  key={stage.key}
                  stage={stage.key}
                  label={stage.label}
                  tone={stage.tone}
                  count={colCandidates.length}
                >
                  {colCandidates.map((candidate) => (
                    <DraggableCandidate
                      key={candidate.id}
                      candidate={candidate}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                    />
                  ))}
                </DroppableColumn>
              );
            })}
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {activeCandidate ? (
            <div className="rotate-2 scale-105 shadow-lg shadow-indigo-650/5">
              <CandidateCard candidate={activeCandidate} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CandidateDrawer
        candidate={drawerCandidate}
        isOpen={!!selectedCandidateId}
        onClose={() => setSelectedCandidateId(null)}
        onStageUpdated={handleStageUpdated}
      />
    </>
  );
}
