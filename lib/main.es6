import {ComponentRegistry, WorkspaceStore} from 'nylas-exports';

// import MyComposerButton from './my-composer-button';
import OctopartSidebar from './octopart-sidebar';

// Activate is called when the package is loaded. If your package previously
// saved state using `serialize` it is provided.
//
export function activate() {
  // ComponentRegistry.register(MyComposerButton, {
  //   role: 'Composer:ActionButton',
  // });
  ComponentRegistry.register(OctopartSidebar, {
    location: WorkspaceStore.Location.MessageListSidebar,
  });
}

// Serialize is called when your package is about to be unmounted.
// You can return a state object that will be passed back to your package
// when it is re-activated.
//
export function serialize() {
}

// This **optional** method is called when the window is shutting down,
// or when your package is being updated or disabled. If your package is
// watching any files, holding external resources, providing commands or
// subscribing to events, release them here.
//
export function deactivate() {
  // ComponentRegistry.unregister(MyComposerButton);
  ComponentRegistry.unregister(OctopartSidebar);
}