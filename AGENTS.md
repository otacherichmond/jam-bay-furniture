<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Owner admin actions (add/delete products & reviews, image uploads) in `src/functions/furniture.ts` are gated server-side by the `ADMIN_PASSCODE` secret; never hardcode or expose the passcode, and never move the check to the client.
