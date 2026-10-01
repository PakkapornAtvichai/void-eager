## Run commands

```bash
cd /home/h3retek/projects/void-eager
npm install
npm run dev -- --host 127.0.0.1
```

Production validation before handoff:
- `npm run build`: passes
- dev server: HTTP 200
- `git diff --check`: passes

Stable hooks include:
`inspect-work-order`, `quick-pin-open`, `open-without-pin`, `confirm-classification`, `return-investigation`, `go-storage`, `inspect-storage-coupler`, `check-storage-serial`, `open-deduction`, `submit-deduction`, `open-reflection`, and `restart-prototype`.
