<template>
  <div>
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />
    <a-tree
      :expanded-keys="expandedKeys"
      default-expand-all
      :auto-expand-parent=true
      :tree-data="gData"
      @expand="onExpand"
      @check="check"
      class="card"
      style="height: calc(100vh - 200px); overflow-y: auto;"
    >
      <template #title="{ title }">
        <span style="white-space: normal;" v-if="title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1">
          {{ title.substr(0, title.toLowerCase().indexOf(searchValue.toLowerCase())) }}
          <span style="color: #f50">{{ searchValue }}</span>

          <a
          @click="scroll(title)"
          >
            {{
              title.substr(
                title.toLowerCase().indexOf(searchValue.toLowerCase()) + searchValue.length,
              )
            }}
          </a>
        </span>
        <a v-else @click="scroll(title)">{{ title }}</a>
      </template>
    </a-tree>
  </div>
</template>
<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
const cleanDeep = require('clean-deep')

export default defineComponent({
  props: {},
  setup(props) {
    const store = useStore()

    const ssp = computed(() => store.getters['ssp/ssp'].ssp)

    const gData = computed(() => {
      return [
        {
          title: 'Prepared By',
          key: '1',
          link:"prepared-by"
        },
        {
          title: 'Prepared For',
          key: '2',
          link:"prepared-for"
        },
        {
          title: 'Information System Name/Title',
          key: '3',
          link:"information-system-name-title"
        },
        {
          title: 'Information System Categorization',
          key: '4',
          link:"information-system-categorization",
          children: [
            {
              title: 'System Sensitivity Level',
              key: '4.1',
              link: "information-system-categorization"
            },
            {
              title: 'Security Objectives Categorization (FIPS 199)',
              key: '4.2',
              link: "information-system-categorization"
            },
            {
              title: 'Digital Identity Determination',
              key: '4.3',
              link: "information-system-categorization"
            }
          ]
        },
        {
          title: 'Information System Owner',
          key: '5',
          link:"information-system-owner"
        },
        {
          title: 'Designated Contacts',
          key: '6',
          link:"other-designated-contacts",
          children: [
            {
              title: 'Management Point of Contact',
              key: '6.1',
              link: "other-designated-contacts"
            },
            {
              title: 'Technical Point of Contact',
              key: '6.2',
              link: "other-designated-contacts"
            },
            {
              title: 'Other Contact',
              key: '6.3',
              link: "other-designated-contacts"
            },
          ],
        },
        {
          title: 'Assignment of Security Responsibility',
          key: '7',
          link: "assignment-of-security-responsibility",
          children: [
            {
              title: 'CSP Name Internal ISSO (or Equivalent) Point of Contact',
              key: '7.1',
              link:'assignment-of-security-responsibility'
            },
            {
              title: 'AO Point of Contact',
              key: '7.2',
              link:'assignment-of-security-responsibility'
            },
          ]
        },
        {
          title: 'Information System Operational Status',
          key: '8',
          link:'information-system-operational-status'
        },
        {
          title: 'Information System Type',
          key: '9',
          link:'information-system-type',
          children: [
            {
              title: 'Service Models',
              key: '9.1',
              link:'information-system-type'
            },
            {
              title: 'Cloud Deployment Models',
              key: '9.2',
              link:'information-system-type'
            },
            {
              title: 'Service Provider Architecture Layers',
              key: '9.3',
              link:'information-system-type'
            },
          ]
        },
        {
          title: 'Leveraged Authorizations',
          key: '10',
          link:'leveraged-authorizations'
        },
        {
          title: 'Network Architecture',
          key: '11',
          link:'network-architecture'
        },
        {
          title: 'System Environment and Inventory',
          key: '12',
          link:'system-environment-and-inventory'
        },
        {
          title: 'Compliance Overview',
          key: '18',
          link:'compliances'
        },
        {
          title: 'Data Flow',
          key: '13',
          link:'data-flow'
        },
        {
          title: 'Ports, Protocols and Services',
          key: '14',
          link:'ports-protocols-and-services'
        },
        {
          title: 'Applicable Standards and Guidance',
          key: '15',
          link:'applicable-standards-and-guidance'
        },
        {
          title: 'Framework Controls',
          key: '16',
          link:'framework-controls'
        },
        // {
        //   title: 'Assessment',
        //   key: '19',
        //   link:'assessment'
        // },
        {
          title: 'Custom Controls',
          key: '17',
          link:'custom-controls'
        }
      ]
    })

    const expandedKeys = ref([])
    const autoExpandParent = ref('')
    const searchValue = ref('')
    const check = (checkedKeys, e) => console.log(checkedKeys, e)
    const onExpand = (keys) => {
      expandedKeys.value = keys
      autoExpandParent.value = false
    }

    const getParentKey = (key, tree,value) => {
      let parentKey

      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]

        if (node.children) {
          if (node.children.some((item) => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1)) {
            parentKey = node.key
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children)
          }
        }
      }

      return parentKey
    }
    const scroll = (title) => {
      // const element = document.getElementById(title);//"#"+title.toLowerCase();
      var link="";
      gData.value.map((item) => {
        if (item.title == title) {
          link = item.link;
        } else {
          if (item.children) {
            item.children.map((item1) => {
              if (item1.title == title) {
                link = item1.link;
              }
            })
          }
        }
      })
      var element = document.getElementById(link);
      console.log("link: ",link);
      if(element){
        var top = element.offsetTop;
        window.scrollTo(1, top);
      }
      // return element;
    }
    watch(searchValue, (value) => {
      // console.log("HELLO from " + value);
      const expanded = gData.value
        .map((item) => {
          if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return getParentKey(item.key, gData.value,value)
          }else{
            return getParentKey(item.key, gData.value,value)
          }
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)

      expandedKeys.value = expanded
      searchValue.value = value
      autoExpandParent.value = true
    })

    watch(
      ssp,
      (value) => {
        // console.log('SSP Update')
      },
      { deep: true },
    )

    expandedKeys.value = gData.value.map((item) => item.key)

    return {
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
      scroll,
      onExpand,
      check,
    }
  },
})
</script>
