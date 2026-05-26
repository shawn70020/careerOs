"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoadmapTreeNode = {
  label: string;
  children?: RoadmapTreeNode[];
};

function TreeNode({
  node,
  depth = 0,
}: {
  node: RoadmapTreeNode;
  depth?: number;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const [open, setOpen] = useState(depth < 1);

  return (
    <li className="list-none">
      <div
        className={cn(
          "flex items-center gap-1 rounded-md py-1 text-sm",
          depth === 0 && "font-medium"
        )}
        style={{ paddingLeft: depth * 16 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-muted"
            aria-expanded={open}
          >
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="inline-block w-6 shrink-0" />
        )}
        <span>{node.label}</span>
      </div>
      {hasChildren && open && (
        <ul className="mt-0.5">
          {node.children!.map((child) => (
            <TreeNode key={child.label} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function RoadmapTree({
  tree,
  title,
}: {
  tree: RoadmapTreeNode[];
  title: string;
}) {
  if (!tree.length) return null;

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <ul>
        {tree.map((node) => (
          <TreeNode key={node.label} node={node} />
        ))}
      </ul>
    </div>
  );
}
