"use server";

import { createGist } from "@/app/actions";

export async function createGistFromForm(formData: FormData) {
  const content = formData.get("content")
  if (!content || content.length === 0) {
    return;
  }

  return createGist(content.toString())
}
