<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { getConfigList, removeConfig } from "../utils/api";

const { t } = useI18n();

const props = defineProps({
  activeConfig: {
    type: String,
    default: null
  }
});

const emit = defineEmits(["select", "edit", "refresh"]);

const configList = ref([]);
const loading = ref(false);
const error = ref("");

async function loadConfigList() {
  loading.value = true;
  error.value = "";
  try {
    const list = await getConfigList();
    configList.value = list;
  } catch (err) {
    error.value = err.message || t('configList.loadFailed');
  } finally {
    loading.value = false;
  }
}

async function handleDelete(cfgName) {
  if (!confirm(t('configList.deleteConfirm', { name: cfgName }))) {
    return;
  }
  try {
    await removeConfig(cfgName);
    emit("refresh");
    await loadConfigList();
  } catch (err) {
    error.value = err.message || t('configList.deleteFailed');
  }
}

function handleSelect(cfgName) {
  emit("select", cfgName);
}

function handleEdit(cfgName) {
  emit("edit", cfgName);
}

onMounted(() => {
  loadConfigList();
});

// Expose method for parent component
defineExpose({
  refresh: loadConfigList
});
</script>

<template>
  <div class="config-list">
    <div class="list-header">
      <h3>{{ t('configList.title') }}</h3>
      <button @click="loadConfigList" class="refresh-btn" :disabled="loading">
        {{ loading ? t('common.loading') : t('common.refresh') }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="configList.length === 0 && !loading" class="empty-state">
      <p>{{ t('configList.empty') }}</p>
      <p class="hint">{{ t('configList.emptyHint') }}</p>
    </div>

    <ul v-else class="list-container">
      <li
        v-for="cfg in configList"
        :key="cfg"
        :class="['config-item', { active: activeConfig === cfg }]"
      >
        <div class="config-info" @click="handleSelect(cfg)">
          <span class="config-name">{{ cfg }}</span>
          <span v-if="activeConfig === cfg" class="active-badge">{{ t('configList.active') }}</span>
        </div>
        <div class="config-actions">
          <button @click="handleEdit(cfg)" class="action-btn edit-btn" :title="t('common.edit')">
            {{ t('common.edit') }}
          </button>
          <button @click="handleDelete(cfg)" class="action-btn delete-btn" :title="t('common.delete')">
            {{ t('common.delete') }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.config-list {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.refresh-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid var(--border-color);
  background: var(--btn-secondary);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--btn-secondary-hover);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 12px;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--text-secondary);
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 8px;
}

.list-container {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--item-bg);
  border-radius: 6px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.config-item:hover {
  background: var(--item-hover);
  border-color: var(--border-color);
}

.config-item.active {
  background: var(--active-item-bg);
  border-color: var(--primary-color);
}

.config-info {
  flex: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-name {
  font-weight: 500;
  color: var(--text-primary);
}

.active-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}

.config-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: var(--btn-info);
  color: white;
}

.edit-btn:hover {
  background: var(--btn-info-hover);
}

.delete-btn {
  background: var(--btn-danger);
  color: white;
}

.delete-btn:hover {
  background: var(--btn-danger-hover);
}
</style>
