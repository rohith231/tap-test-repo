<template>

  <template v-if="!nistControl || Object.keys(nistControl).length === 0 || nistControl == null">
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
  </template>
  <div v-else>
    <v-divider />
    <h1>
       {{ nistControl.number }} 
    </h1> 
    <h2 >
  {{ nistControl.title }} 
    </h2>
    <v-divider />

    <span v-if="framework == 'NIST800171R2' ">
      <strong>Discussion:</strong> {{ nistControl.discussion }} <br>
    </span>
    <strong>Family:</strong> {{ nistControl.family }}<br>
    <div  v-if="framework == 'NIST80053R4' ">
      <strong>Priority:</strong>  <span v-if="Array.isArray(nistControl.priority)">{{ nistControl.priority.join(', ') }}</span><br>
      <strong>Baseline Impact:</strong>  <span v-if="Array.isArray(nistControl.baseline_impact)">{{ nistControl.baseline_impact.join(', ') }}</span><br>
      <strong>Withdrawn: </strong> 
      <span v-if="typeof (nistControl.withdrawn) === 'object' && nistControl.withdrawn != null">
        <span v-if="nistControl.withdrawn.length !== 0">
          incorporated-into {{ nistControl.withdrawn['incorporated-into'] }}
        </span>
      </span>
    </div>
    <div  v-if="framework == 'NIST80053R5' ">
      <strong>Priority:</strong>  <span v-if="Array.isArray(nistControl.priority)">{{ nistControl.priority.join(', ') }}</span><br>
      <strong>Baseline Impact:</strong>  <span v-if="Array.isArray(nistControl.baseline_impact)">{{ nistControl.baseline_impact.join(', ') }}</span><br>
      <strong>Withdrawn: </strong> 
      <span v-if="typeof (nistControl.withdrawn) === 'object' && nistControl.withdrawn != null">
        <span v-if="nistControl.withdrawn.length !== 0">
          incorporated-into {{ nistControl.withdrawn['incorporated-into'] }}
        </span>
      </span>
    </div>
    <div  v-if="framework == 'NIST800171R2' ">
    <strong>Family Abbreviation:</strong> {{ nistControl.family_abbreviation }}<br>
    <strong>Family ID:</strong> {{ nistControl.family_id }}<br>
    <strong>DoD Value:</strong> {{ nistControl.DoD_value }}<br>
    <strong>DoD Guidance:</strong> {{ nistControl.DoD_guidance }}<br>

      <strong>NIST 800-53 r4 Controls:</strong> 
       <v-chip
              v-for="control in nistControl.NIST80053r4_controls"
              :key="control"
              class="mr-2"
              color="light-blue accent-2"
              dark
              x-small
            >
              {{ control }}
            </v-chip>
    <br><br>
    </div>
    <v-divider />



    <!-- check again for empbty controls -->
    <div v-if="nistControl.statement">
      <h2>
        Control Description
      </h2>
      <v-divider />
      <h4>{{ nistControl.statement.description[0] }}</h4>
      <p>
        <span v-if="Array.isArray(nistControl.statement.statement)">
          <ul>
            <li 
              v-for="(x, y, z) in nistControl.statement.statement"
              :key="z"
            >
              <strong>{{ x.number[0] }} </strong> {{ x.description[0] }}
              <ul>
                <li
                  v-for="(xx, yy, zz) in x.statement"
                  :key="zz"
                >
                  <strong>{{ xx.number[0] }} </strong> {{ xx.description[0] }}
                </li>
              </ul>
            </li>
          </ul>
        </span>
        <span v-else>
          {{ nistControl.statement.statement }}
        </span>
      </p><br>
      <v-divider />
      <h2>
        Supplemental Guidance
      </h2>
      <v-divider />
      <div v-if="typeof (nistControl.guidance) === 'object' && nistControl.guidance != null">
        <p>
          <span v-if="Array.isArray(nistControl.guidance.description)">
            {{ nistControl.guidance.description[0] }}
          </span>
          <span v-else>
            {{ nistControl.guidance.description }}
          </span>
        </p>
        <p>
          <span v-if="Array.isArray(nistControl.guidance.related)">
            <strong>Related : </strong> {{ nistControl.guidance.related.join(',') }}
          </span>
        </p>
      </div>
      <br>
      <v-divider />
      <h2>
        Control Enhancements
      </h2>
      <v-divider />
      <div
        v-for="(xxx, yyy, zzz) in nistControl.control_enhancements"
        :key="zzz"
      >
        <h4 class="mt-3">
          {{ xxx.number[0] }} {{ xxx.title[0] }}
        </h4>
        {{ xxx.statement[0].description[0] }}<br>
        <span v-if="(Array.isArray(xxx['baseline-impact']))"><strong>Baseline Impact</strong> {{ xxx['baseline-impact'].join(', ') }} <br></span>
        <span v-if="(Array.isArray(xxx['supplemental-guidance']))">
          <strong>Supplemental Guidance</strong> <br>
          <span
            v-for="(xxxx, yyyy, zzzz) in xxx['supplemental-guidance']"
            :key="zzzz"
          >
            <span v-if="(Array.isArray(xxxx.description))">
              {{ xxxx.description[0] }}<br>
            </span>
            <span v-if="(Array.isArray(xxxx.related))">
              <u>Related</u> : {{ xxxx.related[0] }}<br>
            </span>
          </span>
        </span>
        <span v-if="typeof (xxx.withdrawn) === 'object' && xxx.withdrawn != null">
          <span v-if="xxx.withdrawn.length !== 0">
            <strong>Withdrawn</strong> incorporated-into {{ xxx.withdrawn[0]['incorporated-into'] }}
          </span>
        </span>
      </div>
      <v-divider />
    </div>
    <!-- end check empty -->
    <template v-if="showRelatedControls">
    <div>
      <br>
      <h2>
          NIST 800-53 r4 map controls :
        </h2>
    </div>  
    <div v-for="(related_control,index) in NIST80053r4_controls" :key="index" class="px-1" style="background-color: #f5f5f5 !important;border: 1px solid #eeeeee;border-radius : 5px;" >
      <h3   >
        {{ related_control.number }} 
      </h3  > 
      <br>
      <h5 >
        {{ related_control.title }} 
      </h5>
      <v-divider />

      <span v-if="framework == 'NIST800171R2' ">
        <strong>Discussion:</strong> {{ related_control.discussion }} <br>
      </span>
      <strong>Family:</strong> {{ related_control.family }}<br>
      <div  v-if="framework == 'NIST80053R4' ">
        <strong>Priority:</strong>  <span v-if="Array.isArray(related_control.priority)">{{ related_control.priority.join(', ') }}</span><br>
        <strong>Baseline Impact:</strong>  <span v-if="Array.isArray(related_control.baseline_impact)">{{ related_control.baseline_impact.join(', ') }}</span><br>
        <strong>Withdrawn: </strong> 
        <span v-if="typeof (related_control.withdrawn) === 'object' && related_control.withdrawn != null">
          <span v-if="related_control.withdrawn.length !== 0">
            incorporated-into {{ related_control.withdrawn['incorporated-into'] }}
          </span>
        </span>
      </div>
      <div  v-if="framework == 'NIST80053R5' ">
        <strong>Priority:</strong>  <span v-if="Array.isArray(related_control.priority)">{{ related_control.priority.join(', ') }}</span><br>
        <strong>Baseline Impact:</strong>  <span v-if="Array.isArray(related_control.baseline_impact)">{{ related_control.baseline_impact.join(', ') }}</span><br>
        <strong>Withdrawn: </strong> 
        <span v-if="typeof (related_control.withdrawn) === 'object' && related_control.withdrawn != null">
          <span v-if="related_control.withdrawn.length !== 0">
            incorporated-into {{ related_control.withdrawn['incorporated-into'] }}
          </span>
        </span>
      </div>
      <div  v-if="framework == 'NIST800171R2' ">
      <strong>Family Abbreviation:</strong> {{ related_control.family_abbreviation }}<br>
      <strong>Family ID:</strong> {{ related_control.family_id }}<br>
      <strong>DoD Value:</strong> {{ related_control.DoD_value }}<br>
      <strong>DoD Guidance:</strong> {{ related_control.DoD_guidance }}<br>

      <strong>NIST 800-53 r4 Controls:</strong> 
      <v-chip
              v-for="control in related_control.NIST80053r4_controls"
              :key="control"
              class="mr-2"
              color="light-blue accent-2"
              dark
              x-small
            >
              {{ control }}
      </v-chip>
      <br><br>
      </div>
      <v-divider />

      <div v-if="related_control.statement">
        <h3>
          Control Description
        </h3>
        <v-divider />
        <h4>{{ related_control.statement.description[0] }}</h4>
        <p>
          <span v-if="Array.isArray(related_control.statement.statement)">
            <ul>
              <li 
                v-for="(x, y, z) in related_control.statement.statement"
                :key="z"
              >
                <strong>{{ x.number[0] }} </strong> {{ x.description[0] }}
                <ul>
                  <li
                    v-for="(xx, yy, zz) in x.statement"
                    :key="zz"
                  >
                    <strong>{{ xx.number[0] }} </strong> {{ xx.description[0] }}
                  </li>
                </ul>
              </li>
            </ul>
          </span>
          <span v-else>
            {{ related_control.statement.statement }}
          </span>
        </p><br>
        <v-divider />
        <h3>
          Supplemental Guidance
        </h3>
        <v-divider />
        <div v-if="typeof (related_control.guidance) === 'object' && related_control.guidance != null">
          <p>
            <span v-if="Array.isArray(related_control.guidance.description)">
              {{ related_control.guidance.description[0] }}
            </span>
            <span v-else>
              {{ related_control.guidance.description }}
            </span>
          </p>
          <p>
            <span v-if="Array.isArray(related_control.guidance.related)">
              <strong>Related : </strong> {{ related_control.guidance.related.join(',') }}
            </span>
          </p>
        </div>
        <br>
        <v-divider />
        <h3>
          Control Enhancements
        </h3>
        <v-divider />
        <div
          v-for="(xxx, yyy, zzz) in related_control.control_enhancements"
          :key="zzz"
        >
          <h4 class="mt-3">
            {{ xxx.number[0] }} {{ xxx.title[0] }}
          </h4>
          {{ xxx.statement[0].description[0] }}<br>
          <span v-if="(Array.isArray(xxx['baseline-impact']))"><strong>Baseline Impact</strong> {{ xxx['baseline-impact'].join(', ') }} <br></span>
          <span v-if="(Array.isArray(xxx['supplemental-guidance']))">
            <strong>Supplemental Guidance</strong> <br>
            <span
              v-for="(xxxx, yyyy, zzzz) in xxx['supplemental-guidance']"
              :key="zzzz"
            >
              <span v-if="(Array.isArray(xxxx.description))">
                {{ xxxx.description[0] }}<br>
              </span>
              <span v-if="(Array.isArray(xxxx.related))">
                <u>Related</u> : {{ xxxx.related[0] }}<br>
              </span>
            </span>
          </span>
          <span v-if="typeof (xxx.withdrawn) === 'object' && xxx.withdrawn != null">
            <span v-if="xxx.withdrawn.length !== 0">
              <strong>Withdrawn</strong> incorporated-into {{ xxx.withdrawn[0]['incorporated-into'] }}
            </span>
          </span>
        </div>
        <v-divider />
        <br>
      </div>


    </div>
    </template>
  </div>
</template>

<script>
// import checkControls from '@/services/checkControls';

export default {
    props: {
        nistControl: {
            type: Object,
            required: true,
            default() {
            return {  }
        }
        },
        framework: {
            type: String,
            default() {
            return "NIST80053R4"
          }
        },
        showRelatedControls: {
            type: Boolean,
            default() {
            return false
          }
        },
       
    },
    data() {
      return {
        NIST80053r4_controls: []
      }
    },
    watch: {
      nistControl: [{
        handler: 'getNistControl'
      }]
    },
     // this mounted is probably not necessary
    mounted: function () {
    //   this.getNistControl(this.nistControl)
    },  



    methods: {
      async getNistControl(control) {
        // if(control.NIST80053r4_controls){
        //   const res =  await checkControls.getRelatedControls(control.NIST80053r4_controls);
        //   if (res && !res.errors) {
        //     this.NIST80053r4_controls = res.data.rows;
            
        //   }
        // }
      }
    },
  

}
</script>
