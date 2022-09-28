<template>
  <div>
    <v-row>
      <v-col cols="6" class="flex pa-3">
        <h1 class="typing-text">vertex</h1>
      </v-col>
    </v-row>
  </div>
</template>


<style lang="scss" scoped>
.typing-text {
  width: 6ch;
  animation: typing 2s steps(6), blink 0.5s infinite;
  white-space: nowrap;
  // overflow: hidden;
  border-right: 3px solid;
  font-family: monospace;
  font-size: 2rem;
  text-align: center;
}

@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}
</style>