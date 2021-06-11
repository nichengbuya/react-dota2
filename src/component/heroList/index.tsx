interface Hero {
    complexity: number;
    id: number;
    index_img: string;
    name: string;
    name_english_loc: string;
    name_loc: string;
    primary_attr: number;
}
export default function (props:{data:Hero[]}) {
    const {data} = props;
    const heroList = data.map((i,index)=>{
        return (
            <div key={index}>
                <img  src={i.index_img} alt={i.name} />
            </div>
        )
    })
    return (
        <div>
            {heroList}
        </div>
    )
}