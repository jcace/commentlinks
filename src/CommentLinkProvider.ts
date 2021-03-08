import {
  CodeLensProvider,
  TextDocument,
  CodeLens,
  Range,
  Command,
  window,
  SnippetString,
} from "vscode";

const linkRegex = /\[\[.*\]\]/g;
const findLinks = (doc: string) => {
  const splitDoc = doc.split(/\r?\n/);
  const result: any = [];

  splitDoc.forEach((line, lineNumber) => {
    const match = line.match(linkRegex);
    if (match) {
      result.push({ lN: lineNumber, str: match[0].replace(/(\[|\])/g, "") });
    }
  });

  return result;
};

class MyCodeLensProvider implements CodeLensProvider {
  // Each provider requires a provideCodeLenses function which will give the various documents
  // the code lenses
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    // Define where the CodeLens will exist
    console.log(`Parsing ${document.uri}`);

    const matches = findLinks(document.getText());
    console.log(matches);

    if (document.uri.scheme === "output") {
      return [];
    }

    // Define what command we want to trigger when activating the CodeLens

    let lenses: CodeLens[] = [];
    matches.forEach((match: any) => {
      let thisMatchRange = new Range(match.lN, 0, match.lN, 0);
      let c: Command = {
        command: "extension.addConsoleLog",
        title: `Open ${match.str}`,
      };
      lenses.push(new CodeLens(thisMatchRange, c));
    });

    return lenses;
  }
}

export async function addConsoleLog() {
  let lineNumStr = await window.showInputBox({
    prompt: "Line Number",
  });

  let lineNum = Number(lineNumStr);

  let insertionLocation = new Range(lineNum, 0, lineNum, 0);
  let snippet = new SnippetString("console.log($1);\n");

  if (window && window.activeTextEditor) {
    window.activeTextEditor.insertSnippet(snippet, insertionLocation);
  }
}

export default MyCodeLensProvider;
