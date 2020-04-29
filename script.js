Vue.component('task', {
    props: ['data'],
    methods: {
        status_changer(){
            this.$emit('status_changer');
        },
        bulk_deleter(){
            this.$emit('bulk_deleter')
        },
        add_task(){
            this.$emit('add_task')
        },
    },
    template: `
  <label class="container whelper">{{ data.title }}
    <input type="checkbox" :id="data.id" :checked="data.status" @click="status_changer();">
        <span class="checkmark" ></span>
        <span class="chwhelper"></span>
  </label>
    `
})

var HTTP = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/'
});
var db_data_array = []; // for promise while get data from db
var nid = []; // for promise in new id set up
var ntitle = []; // for promise in new title set up

HTTP.get('/todolist/?format=json').then(function (response)  {
    response.data.forEach(async function (item, index, array) {
        await db_data_array.push(item);
    })
    return db_data_array; // here we get data from db
})

var vue = new Vue({
    el:'#app',
    data: {
        new_task: {
            title: ''
        }
        ,
        tasks: db_data_array
    },
    methods: {
        bulk_deleter(){ // delete checked tasks
            var urls_to_delete = [];
            var index_to_delete = [];
            var all_items = [];

            all_items = this.tasks
            this.tasks.forEach(async function (item, index, array){
                if (item.status == true) {
                    url = "/todolist/" + item.id + "/";
                    urls_to_delete.push(url);
                    await index_to_delete.push(item.id);
                }
            });

            urls_to_delete.forEach(function (item, index, array){ // delete data in back-end
                HTTP.delete(item)
            });
            index_to_delete.forEach(async function (item, index, array){ // delete data in fron-end
                console.log(all_items)
                item_to_delete = '';
                all_items.forEach(function (frontItem, index) {
                    console.log(all_items['id'])
                    if (frontItem.id == item) {
                        all_items.splice(index, 1)
                    }
                    return all_items;
                })

            });
            this.tasks = all_items;
            return this.tasks;
        }
        ,

        add_task() // add task visual and in db
        {
            nid = this.tasks
            ntitle.title = this.new_task.title
            if (ntitle.title != '') {
                data = {
                    "title": ntitle.title, // get data from user
                    "status": false
                }
                HTTP.post('/todolist/', data).then(function (response)  { // update data in back-end
                    nid.push({
                        id: response.data.id,
                        title: ntitle.title,
                        status: false,
                    })
                    return nid;
                })
                this.tasks = nid // update data in front-end
                this.new_task.title = '';
            };
        }
        ,
        status_changer(id, status){ // change status in front- and back-end
            this.tasks.forEach(async function (item, index, array) {
                if (item.id == id){
                    item.status = await !item.status

                }
                return this.tasks; // front-end
            })

            const options = {
                headers: {'Content-Type': 'application/json'}
            };
            data = {
                "status": !status
            };
            url = "/todolist/" + id + "/";
            HTTP.patch(url, data, options.headers) // back-end
            return this.tasks;

        },
    }
});
