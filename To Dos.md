##To Dos
- [ ] A way to trigger a refresh of the menu after the group has been changed (both upsert and delete)
- [ ] Refactor the GroupLauncher to work from application support
- [ ] See if you can still allow the command line tools, it seem like the application support tool requires electron to work
    - Can we trigger the running electron instance?
    - Would it be fesable to parse the application support file directly?
        - Would that make it more difficult to make the app cross platform?
        - If you _do_ interogate the file directly, would it make more sense to cut out a dependency and write the app support package yourself? You'd be kind of doing that anyway.
