<script>
export default {
    props: {
        pills: {
            type: Boolean,
            default: true
        },
        currentPage: {
            type: Number,
            required: true
        },
        totalRows: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            ex4CurrentPage: this.currentPage
        }
    },
    watch: {
        currentPage(newPage) {
            this.ex4CurrentPage = newPage;
        },
        ex4CurrentPage(newPage) {
            this.$emit('update:currentPage', newPage);
        }
    }
}
</script>

<template>
    <BRow class="justify-content-between align-items-center">
        <BCol class="col-auto mx-auto mx-md-0 me-md-auto">
            <p class="text-muted mb-0">
                Showing <b>{{ totalRows === 0 ? 0 : (((ex4CurrentPage - 1) * perPage) + 1) }}</b> to <b>{{ Math.min(ex4CurrentPage * perPage, totalRows) }}</b> of <b>{{ totalRows }}</b> entries
            </p>
        </BCol>
        <BCol class="col-auto mx-auto mx-md-0 ms-md-auto">
            <BCard no-body class="d-inline-block ms-auto mb-0">
                <BCardBody class="p-2">
                    <nav aria-label="Page navigation example" class="mb-0">
                        <BPagination 
                            v-model="ex4CurrentPage" 
                            :pills="pills" 
                            :total-rows="totalRows" 
                            :per-page="perPage" 
                            align="end" 
                        />
                    </nav>
                </BCardBody>
            </BCard>
        </BCol>
    </BRow>
</template>
