export interface PersonMediaFields {
  id: string;
  photo?: string | null;
  thumb?: string | null;
}

export interface PersonMediaUploadRequest {
  dataUrl: string;
  folder: string;
  publicId: string;
}

export type UploadPersonMediaAsset = (
  request: PersonMediaUploadRequest,
) => Promise<string>;

function isInlineImage(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image");
}

function slugifySegment(value: string | null | undefined, fallback: string) {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

async function persistMediaField(
  value: string | null | undefined,
  uploadAsset: UploadPersonMediaAsset,
  folder: string,
  publicId: string,
) {
  if (!isInlineImage(value)) {
    return value;
  }

  return await uploadAsset({
    dataUrl: value,
    folder,
    publicId,
  });
}

export async function persistPersonMedia<T extends PersonMediaFields>(
  persons: T[],
  uploadAsset: UploadPersonMediaAsset,
  options: {
    documentId?: string | null;
    baseFolder?: string;
  } = {},
): Promise<T[]> {
  const baseFolder = options.baseFolder ?? "notery_persons";
  const documentSegment = slugifySegment(options.documentId, "draft");

  return await Promise.all(
    persons.map(async (person, index) => {
      const personSegment = slugifySegment(person.id, `person-${index + 1}`);
      const photo = await persistMediaField(
        person.photo,
        uploadAsset,
        `${baseFolder}/photos`,
        `${documentSegment}-${personSegment}-photo`,
      );
      const thumb = await persistMediaField(
        person.thumb,
        uploadAsset,
        `${baseFolder}/thumbs`,
        `${documentSegment}-${personSegment}-thumb`,
      );

      return {
        ...person,
        photo,
        thumb,
      };
    }),
  );
}
