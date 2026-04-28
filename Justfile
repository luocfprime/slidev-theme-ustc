base := "slidev-theme-ustc"

# Build and serve with GitHub Pages subpath simulation
preview:
    pnpm exec slidev build example.md --base /{{base}}/
    python3 serve.py
