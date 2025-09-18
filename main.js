//arrow functions
//template literals
//array/object destructuring
//spread operator
//function hoisting(函数声明会提升，函数表达式不会)

// ---------- dom helpers
const $ = sel => document.querySelector(sel);
// 'hello' + value -> `hello${value}`
const fmt = num => `$ ${Number(num).toFixed(2)}`;

// ---------- App state
let state = {
    meta: { createdAt : new Date().toISOString().slice(0,10), currency:'AUD'},
    expenses:[] //{id, title, category, amount, date}
}
const sum = (...nums)=> nums.reduce((acc,n)=>acc+ Number(n || 0),0)

// ---------- Render UI
function render(list = state.expenses){
    const ul = $('#items');
    ul.innerHTML = list.map(({id, title, category, amount, date}) =>`
        <li>
            <div>
                <div>
                    <strong>${title}</strong>
                    <span class='pill'>${category}</span>
                </div>
                <div class='meta'>${date || '-'}</div>
            </div>
            <div>
                <span class='amount'>${fmt(amount)}</span>
                <button class='remove' data-id='${id}'>Remove</button>
            </div>
        </li>
    `).join('');
    const total = sum(...state.expenses.map(item=>item.amount));
    $(`#total`).textContent = `Total: ${fmt(total)}`;
}

// ---------- Add new expense
$('#add-form').addEventListener('submit',e=>{
    e.preventDefault();
    const el = e.currentTarget.elements;
    const {value:title} = el.itemTitle;
    const {value:category} = el.category;
    const {value:amountStr} = el.amount;
    const {value:date} = el.date;

    if(!title.trim()) return;
    const amount = Number(amountStr || 0)
    // crypto 是browser内置的全局api，如果browser不支持，则使用后面的随机数fallback
    const id = (crypto.randomUUID?.() ?? (Date.now() + Math.random().toString(16).slice(2)));
    const item = {id,title,category,amount,date};
    state = {...state,expenses:[...state.expenses,item]};
    e.currentTarget.reset();
    render();
    applyFilters();
})

// ---------- Filters
$('#clear').addEventListener('click', ()=>{
    $('#search').value = '';
    $('#cat').value = 'All'
    render();
    applyFilters();
})

const applyFilters = ()=>{
    const search = $('#search').value.trim().toLowerCase();
    const cat = $('#cat').value;
    const list = state.expenses.filter(({title,category})=>
    (cat === 'All' || category === cat) &&
    (search === '' || title.toLowerCase().includes(search))
    )
    render(list);
}
$('#search').addEventListener('input',applyFilters);
$('#cat').addEventListener('change',applyFilters)

// ---------- Sort
$('#sort-amount').addEventListener('click', ()=>{
    state = {...state, expenses:[...state.expenses].sort((a,b)=> b.amount - a.amount)};
    render();
    applyFilters();
})
$('#sort-date').addEventListener('click', ()=>{
    state = {...state, expenses:[...state.expenses].sort((a,b)=> (b.date || '').localeCompare(a.date || ''))};
    render();
    applyFilters();
})

// ---------- Remove
$('#items').addEventListener('click', e=>{
    const btn = e.target.closest('button.remove');
    if(!btn) return;
    const {id} = btn.dataset;
    state = {...state, expenses: state.expenses.filter(item => item.id !=id)};
    render();
    applyFilters();
})

// ---------- Load initial data

// ---------- Initial render
render()