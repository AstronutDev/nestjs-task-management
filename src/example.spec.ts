import { freemem } from "os";

//feature
class FriendList {
    friends = []

    addFriend(name:string) {
        this.friends.push(name)
        this.announceFriendList(name)
    }

    announceFriendList(name: string) {
        global.console.log(`now ${name} is a friend`);   
    }
    
    removeFriend(name: string) {
        let idx = this.friends.indexOf(name)

        if(idx === -1) {
            throw new Error('friend not found')
        }

        this.friends.splice(idx, 1)
    }
}

//test
describe('FriendList', () =>{
    let friendList

    beforeEach(() => {
        friendList = new FriendList()
    })

    it('init friendList', () => {
        expect(friendList.friends.length).toEqual(0)
    })    

    it('add friend to friendList', () => {
        friendList.addFriend('John')
        expect(friendList.friends.length).toEqual(1)
    }) 

    it('announce frinedship', () => {
        friendList.announceFriendList = jest.fn()
        expect(friendList.announceFriendList).not.toHaveBeenCalledWith('Jame')
        friendList.addFriend('Jame')
        expect(friendList.announceFriendList).toHaveBeenCalledWith('Jame')
    })  

    describe('removeFriend', () => {
        it('remove friend from the list', () => {
            friendList.addFriend('007')
            expect(friendList.friends[0]).toEqual('007')
            friendList.removeFriend('007')
            expect(friendList.friends[0]).toBeUndefined()
        })

        it('thorw error as friend does not exist', () => {
            expect(() => friendList.removeFriend('007')).toThrow(new Error('friend not found'))
        })
    })
})