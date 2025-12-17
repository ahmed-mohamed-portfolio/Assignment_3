// Bonus (2 Grades)
// How to deliver the bonus?
// 1- Solve the problem Majority Element on LeetCode        https://leetcode.com/problems/majority-element/description/?envType=study-plan-v2&envId=top-interview-150
// 2- Inside your assignment folder, create a SEPARATE FILE and name it“bonus.js”
// 3- Copy the code that you have submitted on the website inside ”bonus.js” file

//===================================
// Given an array nums of size n, return the majority element.

// The majority element is the element that appears more than ⌊n / 2⌋ times. 
// You may assume that the majority element always exists in the array.


// Example 1:

// Input: nums = [3,2,3]
// Output: 3
// Example 2:

// Input: nums = [2,2,1,1,1,2,2]
// Output: 2
//===================================

const nums = [8,8,7,7,7];

function majority(nums) {

let count =0 ;
// console.log(Math.floor(nums.length/2));

for (let i = 0; i < nums.length; i++) {

    for (let j = 0; j < nums.length; j++) {

        if(nums[i]==nums[j]){

            count ++;
            // console.log(nums[i],"-",i,"-",nums[j],"-",j,"-",count);
            
        }

        if(count > Math.floor(nums.length/2)){
            return nums[i]
        }

    }
    count=0;
}
    
}

console.log(majority(nums));
