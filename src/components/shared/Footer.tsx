export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {currentYear} CampusVote. All rights reserved.</p>
        <p className="text-sm mt-1">Empowering Institutional Elections</p>
      </div>
    </footer>
  );
}
