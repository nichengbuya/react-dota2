export default class heroService{
    async getHeroList(){
        try {
			const response= await fetch(`/api1/datafeed/heroList?task=herolist`)
			const data = await response.json()
            return data.result.heroes;
		} catch (error) {
			throw new Error('error')
		}
    }
	async getHeroDetail(id:number){
		try {
			const response= await fetch(`/api1/datafeed/hero?hero_id=${id}`)
			const data = await response.json()
            return data.result.heroes;
		} catch (error) {
			throw new Error('error')
		}
	}
}