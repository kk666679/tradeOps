export default function ProductPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl text-center">
      <h1 className="text-5xl font-extrabold mb-6">The Complete Operations Stack.</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-12">Every tool your CFS and Free Zone needs.</p>
      {/* 可以在此引入左侧 components/marketing/features/ 里的组件 */}
      <div className="p-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
        <p>Product Features Component Integration Here</p>
      </div>
    </div>
  );
}
