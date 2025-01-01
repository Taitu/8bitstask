<template>
  <div class="loader">
    <div class="loader__spinner" />
  </div>
</template>


<style lang="scss" scoped>
.loader {
  width: 100%;
  height: 100%;
  background: rgba(#fff, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  &__spinner {
    width: 26px;
    padding: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #25b09b;
    --_m: 
      conic-gradient(#0000 10%,#000),
      linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
            mask: var(--_m);
    -webkit-mask-composite: source-out;
            mask-composite: subtract;
    animation: l3 1s infinite linear;
  }
}
@keyframes l3 {to{transform: rotate(1turn)}}
</style>