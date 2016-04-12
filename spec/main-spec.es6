import {ComponentRegistry, WorkspaceStore} from 'nylas-exports';
import {activate, deactivate} from '../lib/main';

import OctopartSidebar from '../lib/octopart-sidebar';

describe("activate", () => {
  it("should register the composer button and sidebar", () => {
    spyOn(ComponentRegistry, 'register');
    activate();
    expect(ComponentRegistry.register).toHaveBeenCalledWith(OctopartSidebar, {location: WorkspaceStore.Location.MessageListSidebar});
  });
});

describe("deactivate", () => {
  it("should unregister the composer button and sidebar", () => {
    spyOn(ComponentRegistry, 'unregister');
    deactivate();
    expect(ComponentRegistry.unregister).toHaveBeenCalledWith(OctopartSidebar);
  });
});
