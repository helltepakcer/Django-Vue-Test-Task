Vue.component('task', {
    props: ['data'],
    methods: {
        done() {
            this.$emit('done');
        },
        db_delete() {
            this.$emit('db_delete');
        },
        status_changer(){
            this.$emit('status_changer');
        }

    },
    template:`
    <li><input type="checkbox" :id="data.id" :checked="data.status"><label @click="status_changer();" :for="data.id">{{ data.title }}</label>
    <span @click="done();db_delete();" class="close"></span></li>
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
            done_task(id) // visual data delete
            {
                this.tasks.splice(id, 1);
            },
            db_delete(dataid) // delete data from db
            {
                url = "/todolist/" + dataid;
                HTTP.delete(url);

            }
            ,
            add_task() // add task visual and in db
            {
                nid = this.tasks
                ntitle.title = this.new_task.title
                if (ntitle.title != '') {
                        data = {
                            "title": ntitle.title,
                            "status": false
                                }
                HTTP.post('/todolist/', data).then(async function (response)  {
                    nid.push({
                        id: response.data.id,
                        title: ntitle.title,
                        status: false,
                            })
                    return nid;
                                                                                })
                    this.tasks = nid
                    this.new_task.title = '';
                                    };
            }
            ,
            status_changer(id, status){
                const options = {
                    headers: {'Content-Type': 'application/json'}
                };
                    data = {
                        "status": !status
                            };
                    url = "/todolist/" + id + "/";
                    HTTP.patch(url, data, options.headers);
            },
        }
});
