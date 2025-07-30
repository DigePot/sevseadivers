export const extractErrorMessage = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html")
  const preTag = doc.querySelector("pre")

  if (preTag) {
    const errorText = preTag.innerText // Get the error message inside <pre> tag
    // Match the part of the message that starts with "Error: " and ends before any line breaks or additional information
    const match = errorText.match(/Error:\s*(.*?)(?=\s*at|$)/)
    return match ? match[1] : errorText // Return just the error message or the whole text if not found
  }

  return "An unknown error occurred"
}
