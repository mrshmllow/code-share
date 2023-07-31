import Spinner from "./icons/Spinner";

export function NameContent({
  name,
  aiCompleted,
}: {
  name: string | null;
  aiCompleted: boolean;
}) {
  return (
    <>
      {!name && !aiCompleted ? (
        <>
          <span>generting snippet name</span>

          <span className="w-5 h-5">
            <Spinner />
          </span>
        </>
      ) : !name ? (
        <em>untitled snippet</em>
      ) : (
        <span>{name}</span>
      )}
    </>
  );
}
