import Sara from "../images/sara.png";
import John from "../images/john.png";
import Family from "../images/family.png";

export const personImage = (person) => {
    return person.personImage || (person.gender === 'male' ? John : Sara);
};

export const treeImage = (tree) => {
    return tree.treeImage || Family;
};