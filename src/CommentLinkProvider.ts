import {
  CodeLensProvider,
  TextDocument,
  CodeLens,
  Range,
  Command,
  Uri,
  workspace,
} from "vscode";
import { resolve, join } from "path";
import findLinksInDoc from "./findLinksInDoc";
import { lstatSync } from "fs";

const LINK_REGEX = /^(\.{1,2}[\/\\])?(.+?)$/;

class CommentLinkProvider implements CodeLensProvider {
  // Each provider requires a provideCodeLenses function which will give the various documents
  // the code lenses
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const workspacePath =
      workspace.getWorkspaceFolder(document.uri)?.uri?.fsPath ?? "";
    const basePath = join(document.uri.fsPath, "..");

    const matches = findLinksInDoc(document.getText());

    if (document.uri.scheme === "output") {
      return [];
    }

    let lenses: CodeLens[] = [];
    matches.forEach((match: any) => {
      const components = LINK_REGEX.exec(match.str)!;
      const filePath = components[2];
      const relativeFolder = components[1];

      const thisMatchRange = new Range(match.lN, 0, match.lN, 0);
      const fullPath = relativeFolder
        ? resolve(basePath, relativeFolder, filePath)
        : resolve(workspacePath, filePath);
      const fileUri = Uri.file(fullPath);
      const exists = lstatSync(fullPath).isFile();

      // Don't show the codelens if the file doesn't exist
      if (!exists) {
        return;
      }

      let c: Command = {
        command: "vscode.open",
        title: `Open ${match.str}`,
        arguments: [fileUri],
      };
      lenses.push(new CodeLens(thisMatchRange, c));
    });

    return lenses;
  }
}

export default CommentLinkProvider;
