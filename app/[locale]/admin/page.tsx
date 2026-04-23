import { Link } from "@/i18n/navigation";
import { fetchAllWods } from "@/lib/actions/wod.actions";
import { Button } from "@/components/ui/Button";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const wods = await fetchAllWods();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-5xl uppercase text-heading">Admin</h1>
        <Link href="/admin/new" locale={locale}><Button>New WoD</Button></Link>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2 text-xs uppercase text-muted">
        <div className="rounded-[4px] border border-divider bg-surface-1 p-3">Total {wods.length}</div>
        <div className="rounded-[4px] border border-divider bg-surface-1 p-3">Published {wods.filter((w) => w.is_published).length}</div>
        <div className="rounded-[4px] border border-divider bg-surface-1 p-3">Drafts {wods.filter((w) => !w.is_published).length}</div>
      </div>
      <div className="overflow-x-auto rounded-[4px] border border-divider">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-1 text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wods.map((wod) => (
              <tr key={wod.id} className="border-t border-divider">
                <td className="px-3 py-2">{wod.title_en}</td>
                <td className="px-3 py-2">{wod.wod_type}</td>
                <td className="px-3 py-2">{wod.is_published ? "Published" : "Draft"}</td>
                <td className="px-3 py-2"><Link href={`/admin/edit/${wod.id}`} locale={locale} className="text-lime">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
