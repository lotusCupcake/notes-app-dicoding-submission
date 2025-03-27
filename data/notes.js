const API_URL =
  "https://raw.githubusercontent.com/dicodingacademy/a163-bfwd-labs/099-shared-files/notes.js";

export async function fetchNotes() {
  try {
    const response = await fetch(API_URL);
    const scriptText = await response.text();

    const scriptFunction = new Function(scriptText + "; return notesData;");
    const notesData = scriptFunction();

    return notesData;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    return [];
  }
}

export function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}
