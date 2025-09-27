#include<iostream>
using namespace std;

#define max 5

class cque{
    private:
    int front=-1;
    int rear=-1;
    public:
    int arr[max];
    void addq(int x);
};


void cque::addq(int x){
    if (front==0 && rear==max-1)
    {
        cout<<"Queue is full."<<endl;
    }
    if (front!=0 && rear==max-1)
    {
        rear=0;
        arr[rear]=x;
    }
    else{
        rear++;
        arr[rear]=x;
    }
}

int main(){
    cque c;
    c.addq(4);
    cout<<c.arr;
    return 0;
}