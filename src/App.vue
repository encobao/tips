<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      absolute
    >
      <v-btn
        class="font-weight-bold px-0 text-h6"
        text
        @click="reload"
      >SHARE TIPS</v-btn>
      
      <v-spacer></v-spacer>
      
      <v-btn  
        class="px-0"
        text
        @click="confirmDialog = true" 
      >Reset</v-btn>
                
    </v-app-bar>

    <v-main>
        <v-card 
          class="mx-auto mt-12"
          max-width="500"
          flat
        >
          <v-data-table
            class="mt-5"
            :headers="headers"
            :items="servers"
            mobile-breakpoint="300"
            hide-default-footer
          >
            <template v-slot:top>
              <v-toolbar 
                flat 
                color="white"
                bottom
              >
                
                  <v-text-field
                    v-model="totalTips"
                    :color="textEditColor"
                    type="number"
                    label="Tips"
                    :rules="totalTipsRules"
                    placeholder="0.00"
                    prefix="$"
                    outlined
                    dense
                    :hide-details=true
                    @change="formatTotalTips"
                  ></v-text-field>

                  <v-divider
                    class="mx-6"
                    inset
                    vertical
                  ></v-divider>

                  <v-dialog v-model="dialog" max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="secondary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >Add server</v-btn>
                    </template>
                    
                    <v-card class="pa-2">
                      <v-form 
                        ref="newServerForm"
                        v-model="formNewValid"
                      >
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        
                        <v-card-text>
                            <v-text-field 
                              v-model="editedItem.name"
                              :color="textEditColor"
                              :rules="nameRules" 
                              label="Name"
                            >
                            </v-text-field>
                            <v-text-field 
                              v-model="editedItem.hours"
                              :color="textEditColor"
                              :rules="hoursRules" 
                              label="Hours"
                              type="number"
                              placeholder="0.0"
                            >
                            </v-text-field>
                        </v-card-text>
                        
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn  
                            color="secondary"
                            class="font-weight-bold"
                            text 
                            @click="close"
                          >Cancel</v-btn>
                          <v-btn 
                            class="font-weight-bold"
                            :disabled="!formNewValid"
                            color="secondary" 
                            text 
                            @click="save"
                          >Save</v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-dialog>

                  <v-dialog 
                    v-model="confirmDialog" 
                    max-width="290"
                  >
                    <v-card>
                      <v-card-title class="headline">Confirm</v-card-title>
                      <v-card-text>Are you sure you want to reset the list? All data will be removed.</v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                          color="secondary" 
                          text 
                          @click="reset"
                        >OK</v-btn>
                        <v-btn 
                          color="secondary" 
                          text 
                          @click="confirmDialog = false"
                        >Cancel</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>


              </v-toolbar>
            </template>

            <template v-slot:item.name="props">
                <span class="text-subtitle-1 font-weight-regular text-capitalize"> 
                  {{ props.item.name }}
                </span> 
            </template>

            <template v-slot:item.hours="props">
                <span class="text-subtitle-1 font-weight-regular">
                  {{ parseFloat(props.item.hours).toFixed(1) }}
                </span>
            </template>
            <template v-slot:item.tips="props">
                <span class="text-subtitle-1 font-weight-medium">
                  ${{ (props.item.hours * rate).toFixed(2) }}
                </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                color="secondary"
                class="mr-2"
                @click="editItem(item)"
                small
              >
                mdi-pencil
              </v-icon>
              <v-icon
                color="secondary"
                @click="deleteItem(item)"
                small
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
          <v-divider></v-divider>

        </v-card>
    </v-main>

    <v-footer
      app
      :padless="true"
    >
      <v-card
        flat
        tile
        class="primary lighten-1 text-center"
        width="100%"
      >
        <v-card-text class="white--text pa-2">
          {{ new Date().getFullYear() }} — <strong>Share tips</strong>
        </v-card-text>

      </v-card>
    </v-footer>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  data () {
    return {
      dialog: false,
      confirmDialog: false,
      formNewValid: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 15) || 'Name must be less than 16 characters',
      ],
      hoursRules: [
        v => !!v || 'Hours is required',
        v => !isNaN(v) && v > 0 || 'Not a valid value!',
      ],
      totalTipsRules: [
        v => !isNaN(v) && v >= 0 || 'Not a valid value!',
      ],
      totalTips: 100,
      headers: [
        { text: 'Server', 
          value: 'name',  
          class: 'red--text text--darken-3 text-subtitle-1 font-weight-bold',
        },
        { text: 'Hours', 
          value: 'hours', 
          class: 'red--text text--darken-3 text-subtitle-1 font-weight-bold',
          align: 'center',
        },
        { text: 'Tips', 
          value: 'tips', 
          class: 'red--text text--darken-3 text-subtitle-1 font-weight-bold',
          align: 'end',
        },
        { text: '', 
          value: 'actions', 
          width: '72px',
          sortable: false,
        },
      ],
      servers: [
        {
          name: 'server1',
          hours: 6,
          tips: 6.0,
        },
        {
          name: 'server2',
          hours: 6,
          tips: 23,
        },
        {
          name: 'server3',
          hours: 4,
          tips: 6,
        },
      ],
      editedIndex: -1,
      editedItem: {
          name: '',
          hours: '',
          tips: 0,
      },
      defaultItem: {
          name: '',
          hours: '',
          tips: 0,
      },
      textEditColor: 'grey darken-2',
    }
  },
  computed: {
    totalHours: function () {
      return this.servers.reduce(function(prev, s) {
        return prev + parseFloat(s.hours)
      }, 0).toFixed(1);
    },


    rate: function () {
      return this.totalTips / this.totalHours
    },

    formTitle () {
      return this.editedIndex === -1 ? 'Add server' : 'Edit server'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
        })
        this.$refs.newServerForm.resetValidation()
        this.editedIndex = -1
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.servers[this.editedIndex], this.editedItem)
        } else {
          this.servers.push(this.editedItem)
        }
        this.close()
      },

      editItem (item) {
        this.editedIndex = this.servers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.servers.indexOf(item)
        //confirm('Are you sure you want to delete this item?') && this.servers.splice(index, 1)
        this.servers.splice(index, 1)
      },

      formatTotalTips () {
        /**
        if (this.totalTips >= 0) 
          this.totalTips = parseFloat(this.totalTips).toFixed(2)
        else
         */
        this.totalTips = (this.totalTips > 0) ? parseFloat(this.totalTips).toFixed(2) : ''
      },
      
      reset () {
        //this.confirmDialog = true
        //confirm('Are you sure you want to reset the data?') && this.servers.splice(0, this.servers.length)
        this.confirmDialog = false
        this.servers.splice(0, this.servers.length)
        this.totalTips = ''
      },

      reload () {
        location.reload()
      }

  },
};
</script>
