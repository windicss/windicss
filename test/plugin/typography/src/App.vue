<template>
  <div class="dark antialiased text-gray-900">
    <div class="dark:bg-dark-900">
      <div class="px-4 py-10 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-16 lg:px-8 xl:max-w-6xl">
        <article>
          <h1 class="sr-only">Windi CSS Typography</h1>
          <div class="space-y-10 sm:space-y-12 lg:space-y-20 xl:space-y-24">
            <div class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
              <Markdown/>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Markdown from './components/Markdown.md'

export default defineComponent({
  name: 'App',
  components: {
    Markdown
  }
})
</script>
