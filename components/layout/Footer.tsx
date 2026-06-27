import { TEXT } from "@/constants/TEXT_CONSTANTS";

/** App footer — mirrors the design's copyright band. */
export function Footer() {
  return (
    <footer className="mt-6 rounded-xl bg-white py-5 text-center text-sm text-muted shadow-sm">
      {TEXT.footer.copyright}
    </footer>
  );
}
