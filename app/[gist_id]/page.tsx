"use server"

export default async function GistPage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  // const gist = await db.query.gists.findFirst({
  //   where: eq(gists.id, Number(gist_id)),
  // });

  // if (gist === undefined) return notFound();

  const gist = {
    id: 1,
    name: "Hello World",
    text: "const a = fetch(...)"
  }

  return <div>

  </div>;
}
