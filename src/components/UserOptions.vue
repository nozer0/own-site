<template>
  <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['users'])
  },
  beforeMount () {
    let store = this.$store
    if (!store.state.users) {
      store.dispatch('FETCH_USERS')
    }
  }
}
</script>
