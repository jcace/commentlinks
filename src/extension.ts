import { ExtensionContext, languages } from "vscode";
import CommentLinkProvider from "./CommentLinkProvider";

export function activate(context: ExtensionContext) {
  // Register our CodeLens provider
  let codeLensProviderDisposable = languages.registerCodeLensProvider(
    { language: "*" },
    new CommentLinkProvider()
  );

  // Push the CodeLens provider to the context so it can be disposed of later
  context.subscriptions.push(codeLensProviderDisposable);
}

export function deactivate() {}
