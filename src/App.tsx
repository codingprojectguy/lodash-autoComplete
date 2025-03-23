import { useCallback, useEffect, useState } from 'react'
import debounce from "lodash.debounce";


/*

1. Use the products api: https://dummyjson.com/docs/products.
2. User should be able to select suggestion from the list submit the keyword.
3. User should be able to click a submit button to submit the keyword.
4. User should see a loading indicator while is loading.
5. User should be able to navigate through the component using keyboard(optional)
6. Create your own version of debounce function based on the lodash doc(optional)

*/
const searchAPI = async (keyword:string,limit:Number = 5)=>{
  if(keyword.trim()==="") return;
  return fetch(`https://dummyjson.com/products/search?q=${keyword}&limit=${limit}`)
  .then((res)=> res.json())
  .then((data)=> data.products.map((item:any)=>({id:item.id,title:item.title})))
}

function App() {
const [input, setInput] = useState('');
const [suggestions,setSuggestions]= useState<{id:number;title:string}[]>([]);
const [loading,setLoading] = useState(false);
const [selectedKeyword, setSelectedKeyword] = useState("");

const memoDebouncedSearch = useCallback(
 debounce(async(keyword:string)=>{
  if(keyword.trim()==''){
    setSuggestions([])
    return;
  }
  setLoading(true);
  const list = await searchAPI(keyword)
  setSuggestions(list);
  setLoading(false)
 },2000),[]
)

useEffect(()=> {
  if(input.trim()===''){
    setSuggestions([]);
    return;
  }
  memoDebouncedSearch(input);
},[input])
  return (
    <>
    <div className='app'>
      <div className='searchBar'>
      <input value={input} onChange={(e)=> setInput(e.target.value)}  placeholder="Search products..." /> 
      <button onClick={()=> setSelectedKeyword(input)}>search</button>
      </div>
      <div className='suggestions'>
      {loading && <p>Loading...</p>}
      <ul>
        {suggestions.map((suggestion) =>(
          <li key={suggestion.id} onClick={()=> setInput(suggestion.title)}>
             {suggestion.title}
          </li>
        ))}
      </ul>
      </div>
      <div className='submitkey'></div>
      {selectedKeyword && <h3>Submitted keyword:{selectedKeyword}</h3>}
    </div>
    </>
  )
}

export default App
