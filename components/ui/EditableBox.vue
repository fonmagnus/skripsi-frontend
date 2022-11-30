<template>
  <div
    class="
      flex
      items-center
      px-3
      py-3
      gap-1
      rounded-xl
      text-sm
      transition-all
      relative
      bg-slate-200
      hover:bg-slate-300
    "
    :class="[
      {
        'cursor-pointer': !isEditing,
      },
    ]"
    @click="doEdit"
  >
    <div
      v-if="isSaving"
      class="
        flex
        justify-center
        items-center
        bg-opacity-60
        absolute
        inset-0
        w-full
        h-full
        bg-slate-300
        z-10
        rounded-xl
        text-lg
        font-bold
        transition-all
      "
    >
      Saving
    </div>
    <slot v-if="!isEditing" name="overlay" />
    <span v-if="!isEditing" class="flex justify-between items-center gap-1">
      <span class="grow">
        {{
          inputType === "password" && !hasVisiblePassword
            ? "•".repeat(this.internalValue ? this.internalValue.length : 0)
            : internalValue
        }}
      </span>
      <i v-if="editable" class="bx bx-pencil text-sm"></i>
      <slot name="append-icon"> </slot>
    </span>
    <vs-input
      v-else
      :type="inputType"
      ref="input"
      v-model="internalValue"
      border
      class="w-full text-white text-lg"
      @keyup.enter="saveEdit"
      @click-icon="hasVisiblePassword = !hasVisiblePassword"
      icon-after
      :visiblePassword="hasVisiblePassword"
      :name="name"
    >
      <template v-if="inputType === 'password'" #icon>
        <i v-if="!hasVisiblePassword" class="bx bx-show-alt"></i>
        <i v-else class="bx bx-hide"></i>
      </template>
      <template #message-danger>
        <slot name="warn-message" />
      </template>
    </vs-input>
    <div
      v-if="isEditing"
      class="
        px-2
        rounded-full
        flex
        justify-center
        items-center
        cursor-pointer
        transition-all
        shrink
        bg-indigo-300
        hover:bg-indigo-200
      "
      @click.stop="saveEdit"
    >
      <i class="bx bx-save text-lg"></i>
    </div>
    <div
      v-if="isEditing"
      class="
        px-2
        rounded-full
        flex
        justify-center
        items-center
        cursor-pointer
        hover:bg-slate-500
        transition-all
        shrink
      "
      @click.stop="isEditing = false"
    >
      <i class="bx bx-x-circle text-lg"></i>
    </div>
  </div>
</template>

<script>
import vClickOutside from "v-click-outside";
export default {
  components: {
    vClickOutside,
  },
  props: {
    value: [String, Number],
    isSaving: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    name: String,
    inputType: {
      type: String,
      default: "text",
    },
  },
  data() {
    return {
      isEditing: false,
      hasVisiblePassword: false,
    };
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    doEdit() {
      if (!this.editable) return false;
      this.isEditing = true;
      this.$nextTick(() => {
        const inputs = document.querySelectorAll(".vs-input");
        inputs.forEach((input) => {
          input.style.width = "100%";
        });
        this.$refs.input.$el.querySelector("input").focus();
      });
    },
    saveEdit() {
      if (!this.editable) return false;
      this.isEditing = false;
      this.$emit("save", this.name);
    },
  },
};
</script>