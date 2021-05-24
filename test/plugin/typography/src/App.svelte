<script>
  import Markdown from './lib/Markdown.mdx';
  import RTLTest from './lib/RTLTest.mdx';
</script>

<div class="antialiased text-gray-900">
  <div class="px-4 py-10 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-16 lg:px-8 xl:max-w-6xl">
    <article>
      <h1 class="sr-only">Windi CSS Typography</h1>
      <div class="space-y-10 sm:space-y-12 lg:space-y-20 xl:space-y-24">
        <div class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
          <Markdown/>
        </div>
      </div>
      <hr>
      <div class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto" dir="rtl">
        <RTLTest/>
      </div>
    </article>
  </div>
</div>

<style>
</style>
