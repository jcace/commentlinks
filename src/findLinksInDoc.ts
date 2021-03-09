const commentRegex = /^\*|^\/\/|^\/\*|^\#|^<!--/;
const linkRegex = /\[\[.*\]\]/g;

const isComment = (line: string) => {
  return line.replace(/ /g, "").match(commentRegex);
};

const findLinksInDoc = (doc: string) => {
  const splitDoc = doc.split(/\r?\n/);
  const result: any = [];

  splitDoc.forEach((line, lineNumber) => {
    if (!isComment(line)) {
      return;
    }
    const match = line.match(linkRegex);
    if (match) {
      result.push({ lN: lineNumber, str: match[0].replace(/(\[|\])/g, "") });
    }
  });

  return result;
};

export default findLinksInDoc;
