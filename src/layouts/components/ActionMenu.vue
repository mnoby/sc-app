<script setup>
</script>

<template>
  <VButton
    type="submit"
    color="warning"
    variant="tonal"
    class="ma-0"
  >
    <VIcon
      size="large"
      icon="bx-dots-vertical-rounded"
      color="warning"
    />
    <!-- SECTION Menu -->
    <VMenu
      activator="parent"
      width="80px"
      location="bottom end"
      offset="5px"
    >
      <VList>
        <!-- 👉 View -->
        <VListItem link>
          <VListItemTitle class="text-subtitle-2 text-primary">
            View
          </VListItemTitle>
        </VListItem>

        <!-- 👉 Edit -->
        <VListItem link>
          <VListItemTitle class="text-subtitle-2 text-primary">
            Edit
          </VListItemTitle>
        </VListItem>

        <!-- 👉 Delete -->
        <VListItem link>
          <VListItemTitle class="text-subtitle-2 text-error">
            Delete
          </VListItemTitle>
        </VListItem>

        <!-- Divider -->
        <VDivider class="my-2" />

        <!-- 👉 Set Bill Status -->
        <VListItem link>
          <VListItemTitle class="text-subtitle-2 text-warning">
            Set Bill
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <!-- !SECTION -->
  </VButton>
</template>
