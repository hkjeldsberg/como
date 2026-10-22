/** Slow-moving blurred gradient blobs behind the glass UI. */
export function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-mesh-base">
      <div className="mesh-blob left-[-20%] top-[-10%] size-[55vmax] bg-mesh-1 [animation-duration:28s]" />
      <div className="mesh-blob right-[-25%] top-[20%] size-[50vmax] bg-mesh-2 [animation-duration:34s] [animation-delay:-8s]" />
      <div className="mesh-blob bottom-[-25%] left-[10%] size-[50vmax] bg-mesh-3 [animation-duration:40s] [animation-delay:-16s]" />
    </div>
  );
}
