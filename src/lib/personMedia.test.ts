import test from "node:test";
import assert from "node:assert/strict";

import { persistPersonMedia } from "./personMedia";

test("persistPersonMedia uploads inline thumb and photo data before save", async () => {
  const uploads: Array<{ dataUrl: string; folder: string; publicId: string }> = [];
  const persons = [
    {
      id: "person-1",
      name: "Client One",
      photo: "data:image/jpeg;base64,photo-1",
      thumb: "data:image/png;base64,thumb-1",
    },
    {
      id: "person-2",
      name: "Client Two",
      photo: "https://res.cloudinary.com/demo/image/upload/existing-photo.jpg",
      thumb: undefined,
    },
  ];

  const savedPersons = await persistPersonMedia(
    persons,
    async ({ dataUrl, folder, publicId }) => {
      uploads.push({ dataUrl, folder, publicId });
      return `https://res.cloudinary.com/demo/${folder}/${publicId}.jpg`;
    },
    { documentId: "doc-123" },
  );

  assert.equal(uploads.length, 2);
  assert.deepEqual(uploads[0], {
    dataUrl: "data:image/jpeg;base64,photo-1",
    folder: "notery_persons/photos",
    publicId: "doc-123-person-1-photo",
  });
  assert.deepEqual(uploads[1], {
    dataUrl: "data:image/png;base64,thumb-1",
    folder: "notery_persons/thumbs",
    publicId: "doc-123-person-1-thumb",
  });
  assert.equal(
    savedPersons[0].photo,
    "https://res.cloudinary.com/demo/notery_persons/photos/doc-123-person-1-photo.jpg",
  );
  assert.equal(
    savedPersons[0].thumb,
    "https://res.cloudinary.com/demo/notery_persons/thumbs/doc-123-person-1-thumb.jpg",
  );
  assert.equal(
    savedPersons[1].photo,
    "https://res.cloudinary.com/demo/image/upload/existing-photo.jpg",
  );
  assert.equal(savedPersons[1].thumb, undefined);
  assert.equal(persons[0].photo, "data:image/jpeg;base64,photo-1");
  assert.equal(persons[0].thumb, "data:image/png;base64,thumb-1");
});
