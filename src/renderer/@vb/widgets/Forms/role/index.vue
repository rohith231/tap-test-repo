<template>
      <a-form
      :model="role"
      :rules="rules"
      layout="vertical"
      class="mb-4"
      @finish="onSubmit"
    >
    <div class="row">
      <div class="col-lg-12">
        <a-form-item  required label="Name" name="name">
          <a-input v-model:value="role.name" :disabled="disabled" placeholder="Name" />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <a-form-item label="Permissions">
          <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />
        </a-form-item>
        <div class="row">
          <div class="col-lg-6">
            <a-tree
              :disabled="disabled" checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent"
              :v-model="selectedKeys" :checked-keys="checkedKeys" @check="check"
              :tree-data="groupPermissions.slice(0, 11).map((permission,permission_index) => { return {title: permission.label, key: permission.key,children: Array.from(new Set((permission.subModules).map((subModule) => { return {title: subModule.label, key: subModule.key ,children: subModule.attributes.map((attribute,attribute_index) => { return {title: attribute.label, key: attribute.key }})}}).map(JSON.stringify))).map(JSON.parse)}})"
              @expand="onExpand">

              <template #title="{ title }">
                <span v-if="title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1">
                  {{ title.substr(0, title.toLowerCase().indexOf(searchValue.toLowerCase())) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{ title.substr(title.toLowerCase().indexOf(searchValue.toLowerCase()) + searchValue.length) }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </div>

          <div class="col-lg-6">
            <a-tree
              checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :disabled="disabled"
              :v-model="selectedKeys1" :checked-keys="checkedKeys1" @check="check1"
              :tree-data="groupPermissions.slice(11).map((permission,permission_index) => { return {title: permission.label, key: permission.key,children: Array.from(new Set((permission.subModules).map((subModule) => { return {title: subModule.label, key: subModule.key ,children: subModule.attributes.map((attribute,attribute_index) => { return {title: attribute.label, key: attribute.key }})}}).map(JSON.stringify))).map(JSON.parse)}})"
              @expand="onExpand">
              <template #title="{ title }">
                <span v-if="title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1">
                  {{ title.substr(0, title.toLowerCase().indexOf(searchValue.toLowerCase())) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{ title.substr(title.toLowerCase().indexOf(searchValue.toLowerCase()) + searchValue.length) }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button
        type="submit" html-type="submit" :disabled="disabled"
        class="btn btn-primary px-5 ml-2 pull-right">{{buttonLable}}</button>
        <button  @click="$router.push({ path: '/roles'})" class="btn btn-light px-5 pull-right">Cancel</button>

    </div>
  </a-form>
</template>
<script>
  import {
    ref,
    toRaw,
    computed
  } from 'vue'
  import {
    useStore
  } from 'vuex'
  import {
    watch
  } from 'vue';
  const x = 3;
  const y = 2;
  const z = 1;
  const genData = [];

  const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0';
    const tns = _tns || genData;
    const children = [];

    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({
        title: key,
        key,
      });

      if (i < y) {
        children.push(key);
      }
    }

    if (_level < 0) {
      return tns;
    }

    const level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return generateData(level, key, tns[index].children);
    });
  };

  generateData(z);
  const dataList = [];

  const generateList = data => {

    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      const title = node.label;
      dataList.push({
        key,
        title
      });

      if (node.children) {
        generateList(node.children);
      }
    }
  };


  const getParentKey = (key, tree) => {
    let parentKey;

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];

      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }

    return parentKey;
  };
  export default {
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        },
      },
      disabled: {
        type: Boolean,
        default: () => {
          return false
        },
      },
    },
    setup(props, {
      emit
    }) {
      const previewVisible = false;
      const previewImage = '';
      const store = useStore()
      const rules = {
        name: [{
          required: true,
          message: 'Please input your name!',
          trigger: 'change',
        }, ],
      }

      let role = computed(() => store.getters['roles/roles'].role)
      let groupPermissions = computed(() => store.getters['roles/roles'].groupPermissions)
      let checkedKeys = ref([])
      let checkedKeys1 = ref([])
      const selectedKeys1 = computed(() => {
        var keys = []
        store.getters['roles/roles'].groupPermissions.slice(11).map((permission, permission_index) => {

          if (permission.enabled) {
            keys.push(permission.key)
          }
          permission.subModules.map((subModule) => {
            if (subModule.enabled) {
              keys.push(subModule.key)
            }
            subModule.attributes.map((attribute, attribute_index) => {
              if (attribute.enabled) {
                keys.push(attribute.key)
              }
            })
          })
        })
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        checkedKeys1.value = keys;

        return keys
      })

      const selectedKeys = computed(() => {
        var keys = []
        generateList(groupPermissions.value);


        store.getters['roles/roles'].groupPermissions.slice(0, 11).map((permission, permission_index) => {

          if (permission.enabled) {
            keys.push(permission.key)
          }
          permission.subModules.map((subModule) => {
            if (subModule.enabled) {
              keys.push(subModule.key)

            }
            subModule.attributes.map((attribute, attribute_index) => {
              if (attribute.enabled) {
                keys.push(attribute.key)

              }
            })
          })
        })
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        checkedKeys.value = keys;

        return keys
      })


      store.dispatch('roles/GET_BY_ID', {
        payload: {
          id: props.data.role_id
        }
      })
      const user_systems = []
      const roles = []
      let buttonLable = computed(() => props.data.role_id == 'new' ? 'Save' : 'Update')


      const onSubmit = () => {

        let group_permissions = groupPermissions.value
        groupPermissions.value.map((permission, permission_index) => {
          

          permission.subModules.map((subModule, subModule_index) => {
             groupPermissions.value[permission_index].enabled = false
            if (checkedKeys.value.includes(subModule.key) || checkedKeys1.value.includes(subModule.key)) {
              groupPermissions.value[permission_index].enabled = true
              groupPermissions.value[permission_index].subModules[subModule_index].enabled = true
            }else{
              groupPermissions.value[permission_index].subModules[subModule_index].enabled = false
            }
            subModule.attributes.map((attribute, attribute_index) => {
              if (checkedKeys.value.includes(attribute.key) || checkedKeys1.value.includes(attribute.key)) {
                groupPermissions.value[permission_index].enabled = true
                groupPermissions.value[permission_index].subModules[subModule_index].enabled = true
                groupPermissions.value[permission_index].subModules[subModule_index].attributes[attribute_index].enabled = true
              }else{
                 groupPermissions.value[permission_index].subModules[subModule_index].attributes[attribute_index].enabled = false
              }
            })
          })

          return permission
        })

        if (props.data.role_id != 'new') {
          store.dispatch('roles/UPDATE', {
            payload: {
              ...role.value,
              groupPermissions: groupPermissions.value
            }
          }).then(() => {})
        } else {
          store.dispatch('roles/ADD', {
            payload: {
              ...role.value,
              groupPermissions: groupPermissions.value
            }
          }).then(() => {})

        }




      }

      const handleCancel = () => {
        this.previewVisible = false;
      }




      const expandedKeys = ref([]);
      const searchValue = ref('');
      const autoExpandParent = ref(true);

      const onExpand = keys => {
        expandedKeys.value = keys;
        autoExpandParent.value = false;
      };

      watch(searchValue, value => {

        const expanded = dataList
          .map(item => {
            if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              return getParentKey(item.key, groupPermissions.value);
            }

            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        expandedKeys.value = expanded;
        searchValue.value = value;
        autoExpandParent.value = true;
      });

      const check = (checkedArray, e) => {
        checkedKeys.value = checkedArray
      }
      const check1 = (checkedArray, e) => {
        checkedKeys1.value = checkedArray
      }

      return {
        check,
        check1,
        expandedKeys,
        searchValue,
        autoExpandParent,
        onExpand,
        groupPermissions,
        selectedKeys,
        checkedKeys,
        checkedKeys1,
        selectedKeys1,
        handleCancel,
        onSubmit,
        previewImage,
        previewVisible,
        role,
        roles,
        rules,
        buttonLable,
        user_systems,
      }
    },
  }

</script>
