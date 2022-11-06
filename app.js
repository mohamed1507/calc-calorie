// STORAGE CONTROLLER 
const storageCtrl = (function () {


    // public methods
    return {
        storeItem: function (item) {
            let items

            if (localStorage.getItem('items') === null) {
                items = []
                items.push(item)

                localStorage.setItem('items', JSON.stringify(items))

            } else {
                items = JSON.parse(localStorage.getItem('items'))

                items.push(item)


                localStorage.setItem('items', JSON.stringify(items))

            }

        },
        getItemsFromStorage: function () {
            let items
            if (localStorage.getItem('items') === null) {

                items = []

            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },

        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function (item, index) {
                if (updatedItem.id == item.id) {
                    items.splice(index, 1, updatedItem)

                }
            })
            localStorage.setItem('items', JSON.stringify(items))

        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function (item, index) {
                if (id == item.id) {
                    items.splice(index, 1)

                }
            })
            localStorage.setItem('items', JSON.stringify(items))

        }
        ,clearItemsFromStorage:function () {
            localStorage.removeItem('items')
          }
    }
})()
// ITEM CONTROLLER
const itemCtrl = (function () {
    const item = function (id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    // data structure
    const data = {
        items: storageCtrl.getItemsFromStorage()

        , currentItem: null,
        totalCalories: 0
    }

    // public methods 
    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let ID

            // create id 
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1

            } else {
                ID = 0
            }

            // calories to num

            calories = parseInt(calories)

            // create new item 
            newItem = new item(ID, name, calories)
            data.items.push(newItem)

            return newItem
        },
        getItemById: function (id) {

            let found = null
            // loop through items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item

                }
            })
            return found

        },
        updateItem: function (name, calories) {
            calories = parseInt(calories)

            let found = null
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    found = item

                }
            })



            return found
        },
        deleteItem: function (id) {

            const ids = data.items.map(function (item) {
                return item.id
            })

            const index = ids.indexOf(id)

            data.items.splice(index, 1)

        },
        clearAllItems: function () {
            data.items = []
        },
        setCurrentItem: function (item) {
            data.currentItem = item

        }
        ,
        getCurrentItem: function () {
            return data.currentItem
        }
        ,
        getTotalCalories: function () {
            let total = 0
            data.items.forEach(function (item) {
                total += item.calories

            })
            //   set total calories
            data.totalCalories = total
            // storageCtrl.getItemsFromStorage()
            return data.totalCalories
        },
        logData: function () {
            return data

        }
    }




})()



// ******************UI CONTROLLER******************
const uiCtrl = (function () {
    const uiSelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
        , totalCalories: '.total-calories',

    }


    return {
        populateItemList: function (items) {
            let html = ''
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li> `

            });

            // insert list items
            document.querySelector(uiSelectors.itemList).innerHTML = html
        },
        getItemInput: function () {
            return {
                name: document.querySelector(uiSelectors.itemNameInput).value,
                calories: document.querySelector(uiSelectors.itemCaloriesInput).value
            }
        },

        addListItem: function (item) {

            // show list
            document.querySelector(uiSelectors.itemList).style.display = 'block'
            const li = document.createElement('li')
            li.className = 'collection-item'

            li.id = `item-${item.id}`

            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`

            // insert

            document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(uiSelectors.listItems)

            listItems = Array.from(listItems)
            listItems.forEach(function (item) {
                item.remove()
            })
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(uiSelectors.listItems)


            listItems = Array.from(listItems)
            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute('id')

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`
                }
            })

        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`
            const item = document.querySelector(itemId)
            item.remove()
        }
        , clearInput: function () {
            document.querySelector(uiSelectors.itemNameInput).value = ''
            document.querySelector(uiSelectors.itemCaloriesInput).value = ''
        },
        addItemToForm: function () {
            document.querySelector(uiSelectors.itemNameInput).value = itemCtrl.getCurrentItem().name
            document.querySelector(uiSelectors.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories
            uiCtrl.showEditState()
        }
        ,
        clearEditState: function () {
            uiCtrl.clearInput()
            document.querySelector(uiSelectors.updateBtn).style.display = 'none'
            document.querySelector(uiSelectors.deleteBtn).style.display = 'none'
            document.querySelector(uiSelectors.backBtn).style.display = 'none'
            document.querySelector(uiSelectors.addBtn).style.display = 'inline'
        },
        showEditState: function () {

            document.querySelector(uiSelectors.updateBtn).style.display = 'inline'
            document.querySelector(uiSelectors.deleteBtn).style.display = 'inline'
            document.querySelector(uiSelectors.backBtn).style.display = 'inline'
            document.querySelector(uiSelectors.addBtn).style.display = 'none'
        }


        , hideList: function () {
            document.querySelector(uiSelectors.itemList).style.display = 'none'
        }
        , getSelectors: function () {
            return uiSelectors
        }
        , showTotalCalories: function (totalCalories) {
            document.querySelector(uiSelectors.totalCalories).textContent = totalCalories
            // storageCtrl.getItemsFromStorage()

        }
    }
})()

// **************************APP CONTROLLER************** 
const App = (function (itemCtrl, uiCtrl, storageCtrl) {
    // load event listeners
    const loadEventListeners = function () {
        const uiSelectors = uiCtrl.getSelectors()

        // add item event
        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit)

        // disable submit on enter 

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false

            }

        })
        // edit icon click
        document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick)
        // update 
        document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        // delete
        document.querySelector(uiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

        // back btn

        document.querySelector(uiSelectors.updateBtn).addEventListener('click', uiCtrl.clearEditState)
        // clear
        document.querySelector(uiSelectors.clearBtn).addEventListener('click', clearAllItemsClick)
    }
    const itemAddSubmit = function (e) {
        //   get form input from UIctrl
        const input = uiCtrl.getItemInput()
        // check for
        if (input.name !== '' && input.calories !== '') {
            //add item 

            const newItem = itemCtrl.addItem(input.name, input.calories)

            // add item to ui
            uiCtrl.addListItem(newItem)
            // get total calories

            const totalCalories = itemCtrl.getTotalCalories()

            // add total calories to ui
            uiCtrl.showTotalCalories(totalCalories)
            // store in ls 

            storageCtrl.storeItem(newItem)


            // clear
            uiCtrl.clearInput()

        }



        e.preventDefault()
    }

    // click edit item
    const itemEditClick = function (e) {

        if (e.target.classList.contains('edit-item')) {
            //    get list item id
            const listId = e.target.parentNode.parentNode.id

            // break into an array
            const listIdArr = listId.split('-')

            // get actual id 
            const id = parseInt(listIdArr[1])
            // GET ITEM
            const itemToEdit = itemCtrl.getItemById(id)
            // set current item
            itemCtrl.setCurrentItem(itemToEdit)


            // add item to form
            uiCtrl.addItemToForm()

        }
        e.preventDefault()
    }

    const itemUpdateSubmit = function (e) {
        // get item input
        const input = uiCtrl.getItemInput()

        const updatedItem = itemCtrl.updateItem(input.name, input.calories)
        uiCtrl.updateListItem(updatedItem)

        const totalCalories = itemCtrl.getTotalCalories()

        // add total calories to ui
        uiCtrl.showTotalCalories(totalCalories)

        // update ls 

        storageCtrl.updateItemStorage(updatedItem)
        uiCtrl.clearEditState()

        e.preventDefault()
    }

    // delete

    const itemDeleteSubmit = function (e) {

        const currentItem = itemCtrl.getCurrentItem()
        itemCtrl.deleteItem(currentItem.id)
        // delete from ui 
        uiCtrl.deleteListItem(currentItem.id)

        const totalCalories = itemCtrl.getTotalCalories()

        // add total calories to ui
        uiCtrl.showTotalCalories(totalCalories)

        // delete from ls 

        storageCtrl.deleteItemFromStorage(currentItem.id)
        uiCtrl.clearEditState()
        e.preventDefault()
    }
    // clear items

    const clearAllItemsClick = function () {
        // delete all items 

        itemCtrl.clearAllItems()

        const totalCalories = itemCtrl.getTotalCalories()

        // add total calories to ui
        uiCtrl.showTotalCalories(totalCalories)

        uiCtrl.removeItems()

        // clear from ls 

        storageCtrl.clearItemsFromStorage()
        uiCtrl.hideList()
    }


    // public methods
    return {
        init: function () {
            // clear edit state
            uiCtrl.clearEditState()

            // FETCH ITEMS FROM DATA STRUCTURE
            const items = itemCtrl.getItems()


            // check
            if (items.length === 0) {
                uiCtrl.hideList()


            } else {
                uiCtrl.populateItemList(items)
            }



            loadEventListeners()

        }
    }

})(itemCtrl, uiCtrl, storageCtrl)
App.init()