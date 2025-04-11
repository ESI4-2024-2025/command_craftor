import React, { useState, useEffect } from 'react';
import ButtonsJavaEdition from "./utilities/ButtonsJavaEdition";
import "../styles/GiveCommand.css"
import Enchantements from "../scripts/Enchantements";
import {Simulate} from "react-dom/test-utils";
import copy = Simulate.copy;

function GiveCommand() {
    const [selectedTool, setSelectedTool] = useState('sword');
    const [enchantmentValue, setEnchantmentValue] = useState('');

    /**
     * si material est égal a 0, il n'est pas sélectionnable
     * si material est égal a 1, il est sélectionnable et fait partie des matériaux des armures
     * si material est égal a 2, il est sélectionnable et fait partie des matériaux des outils
     */
    const items = [
        { name: 'Book', value: 'book', type: 1, material: 0 },
        { name: 'Helmet', value: 'helmet', type: 1, material: 1 },
        { name: 'Turtle shell', value: 'turtle_shell', type: 1, material: 0 },
        { name: 'Chestplate', value: 'chestplate', type: 1, material: 1 },
        { name: 'Leggings', value: 'leggings', type: 1, material: 1 },
        { name: 'Boots', value: 'boots', type: 1, material: 1 },
        { name: 'Sword', value: 'sword', type: 1, material: 2 },
        { name: 'Pickaxe', value: 'pickaxe', type: 1, material: 2 },
        { name: 'Axe', value: 'axe', type: 1, material: 2 },
        { name: 'Shovel', value: 'shovel', type: 1, material: 2 },
        { name: 'Hoe', value: 'hoe', type: 1, material: 2 },
        { name: 'Bow', value: 'bow', type: 1, material: 0 },
        { name: 'Fishing rod', value: 'fishing', type: 1, material: 0 },
        { name: 'Trident', value: 'trident', type: 1, material: 0 },
        { name: 'Crossbow', value: 'crossbow', type: 1, material: 0 },
        { name: 'Shears', value: 'shears', type: 1, material: 0 },
        { name: 'Shield', value: 'shield', type: 1, material: 0 },
        { name: 'Elytra', value: 'elytra', type: 1, material: 0 },
        { name: 'Flint and Steel', value: 'flint_and_steel', type: 1, material: 0 },
        { name: 'MARC', value: 'MARC', type: 1, material: 0 }
    ];

    const enchantments = [
        {
            name: 'Mending',
            value: 'mending',
            type: 0,
            description: 'Répare l\'objet lors de l\'obtention d\'orbes d\'expérience.',
            maxLevel: 1
        },
        {
            name: 'Unbreaking',
            value: 'unbreaking',
            type: 0,
            description: 'Augmente la durabilité de l\'objet.',
            maxLevel: 3
        },
        {
            name: 'Curse of Vanishing',
            value: 'curse_of_vanishing',
            type: 0,
            description: 'L\'objet disparaît à la mort du joueur.',
            maxLevel: 1
        },
        {
            name: 'Aqua Affinity',
            value: 'aqua_affinity',
            type: 1,
            description: 'Augmente la vitesse de minage sous l\'eau.',
            maxLevel: 1
        },
        {
            name: 'Blast Protection',
            value: 'blast_protection',
            type: 1,
            description: 'Réduit les dégâts et le recul des explosions.',
            maxLevel: 4
        },
        {
            name: 'Curse of Binding',
            value: 'curse_of_binding',
            type: 1,
            description: 'L\'objet ne peut pas être retiré à moins que le joueur ne meure ou que l\'objet ne se casse.',
            maxLevel: 1
        },
        {
            name: 'Depth Strider',
            value: 'depth_strider',
            type: 1,
            description: 'Augmente la vitesse de déplacement sous l\'eau.',
            maxLevel: 3
        },
        {
            name: 'Feather Falling',
            value: 'feather_falling',
            type: 1,
            description: 'Réduit les dégâts de chute.',
            maxLevel: 4
        },
        {
            name: 'Fire Protection',
            value: 'fire_protection',
            type: 1,
            description: 'Réduit les dégâts de feu et le temps de combustion.',
            maxLevel: 4
        },
        {
            name: 'Frost Walker',
            value: 'frost_walker',
            type: 1,
            description: 'Transforme l\'eau en glace sous les pieds du joueur.',
            maxLevel: 2
        },
        {
            name: 'Projectile Protection',
            value: 'projectile_protection',
            type: 1,
            description: 'Réduit les dégâts des projectiles.',
            maxLevel: 4
        },
        {
            name: 'Protection',
            value: 'protection',
            type: 1,
            description: 'Réduit la plupart des types de dégâts.',
            maxLevel: 4
        },
        {
            name: 'Respiration',
            value: 'respiration',
            type: 1,
            description: 'Prolonge le temps de respiration sous l\'eau.',
            maxLevel: 3
        },
        {
            name: 'Soul Speed',
            value: 'soul_speed',
            type: 1,
            description: 'Augmente la vitesse de marche sur le sable des âmes et la terre des âmes.',
            maxLevel: 3
        },
        {
            name: 'Thorns',
            value: 'thorns',
            type: 1,
            description: 'Renvoie une partie des dégâts au attaquant.',
            maxLevel: 3
        },
        {
            name: 'Swift Sneak',
            value: 'swift_sneak',
            type: 1,
            description: 'Augmente la vitesse du joueur lorsqu\'il s\'accroupit.',
            maxLevel: 3
        },
        {
            name: 'Bane of Arthropods',
            value: 'bane_of_arthropods',
            type: 2,
            description: 'Augmente les dégâts et applique Slowness IV aux mobs arthropodes.',
            maxLevel: 5
        },
        {
            name: 'Efficiency',
            value: 'efficiency',
            type: 2,
            description: 'Augmente la vitesse de minage.',
            maxLevel: 5
        },
        {
            name: 'Fire Aspect',
            value: 'fire_aspect',
            type: 2,
            description: 'Enflamme la cible.',
            maxLevel: 2
        },
        {
            name: 'Looting',
            value: 'looting',
            type: 2,
            description: 'Augmente la quantité de butin obtenu des mobs.',
            maxLevel: 3
        },
        {
            name: 'Impaling',
            value: 'impaling',
            type: 2,
            description: 'Le trident inflige des dégâts supplémentaires aux mobs qui apparaissent naturellement dans l\'océan.',
            maxLevel: 5
        },
        {
            name: 'Knockback',
            value: 'knockback',
            type: 2,
            description: 'Repousse les mobs loin de vous lorsqu\'ils sont touchés.',
            maxLevel: 2
        },
        {
            name: 'Sharpness',
            value: 'sharpness',
            type: 2,
            description: 'Augmente les dégâts de l\'arme.',
            maxLevel: 5
        },
        {
            name: 'Smite',
            value: 'smite',
            type: 2,
            description: 'Augmente les dégâts aux mobs morts-vivants.',
            maxLevel: 5
        },
        {
            name: 'Sweeping Edge',
            value: 'sweeping_edge',
            type: 2,
            description: 'Augmente les dégâts de l\'attaque de balayage. Disponible uniquement en Java Edition.',
            maxLevel: 3
        },
        {
            name: 'Channeling',
            value: 'channeling',
            type: 3,
            description: 'Le trident invoque un éclair lorsqu\'il touche un mob pendant un orage.',
            maxLevel: 1
        },
        {
            name: 'Flame',
            value: 'flame',
            type: 3,
            description: 'Les flèches enflamment les cibles.',
            maxLevel: 1
        },
        {
            name: 'Infinity',
            value: 'infinity',
            type: 3,
            description: 'Tirer une flèche ne consomme pas de munitions. Ne fonctionne pas avec les flèches à pointe.',
            maxLevel: 1
        },
        {
            name: 'Loyalty',
            value: 'loyalty',
            type: 3,
            description: 'Le trident revient après avoir été lancé.',
            maxLevel: 3
        },
        {
            name: 'Riptide',
            value: 'riptide',
            type: 3,
            description: 'Le trident propulse le joueur lorsqu\'il est lancé sous l\'eau ou sous la pluie.',
            maxLevel: 3
        },
        {
            name: 'Multishot',
            value: 'multishot',
            type: 3,
            description: 'Tire trois flèches en même temps mais ne consomme qu\'une flèche.',
            maxLevel: 1
        },
        {
            name: 'Piercing',
            value: 'piercing',
            type: 3,
            description: 'Les flèches peuvent traverser les entités.',
            maxLevel: 4
        },
        {
            name: 'Power',
            value: 'power',
            type: 3,
            description: 'Augmente les dégâts des flèches.',
            maxLevel: 5
        },
        {
            name: 'Punch',
            value: 'punch',
            type: 3,
            description: 'Augmente le recul des flèches.',
            maxLevel: 2
        },
        {
            name: 'Quick Charge',
            value: 'quick_charge',
            type: 3,
            description: 'Diminue le temps de recharge de l\'arbalète.',
            maxLevel: 3
        },{
            name: 'Fortune',
            value: 'fortune',
            type: 4,
            description: 'Augmente le maximum de loot drop par les blocs.',
            maxLevel: 3
        },
        {
            name: 'Luck of the Sea',
            value: 'luck_of_the_sea',
            type: 4,
            description: 'Augmente les chances d\'obtenir de meilleurs loot lors de la pêche.',
            maxLevel: 3
        },
        {
            name: 'Lure',
            value: 'lure',
            type: 4,
            description: 'Diminue le temps d\'attente pour attraper quelque chose lors de la pêche.',
            maxLevel: 3
        },
        {
            name: 'Silk Touch',
            value: 'silk_touch',
            type: 4,
            description: 'Permet de récupérer les blocs dans leur état original.',
            maxLevel: 1
        }
    ];

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTool(event.target.value);
    }

    const copyToClipboard = (event: React.MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText(enchantmentValue).then(r => console.log('copied'));
    }

    useEffect(() => {
        setEnchantmentValue(Enchantements({tool : selectedTool}));
    }, [selectedTool]);

    return (
        <div className="give-command" data-testid="GiveCommand">

            <select name="item" id="item" value={selectedTool} onChange={handleSelectChange}>
                {items.map(item => (
                    <option key={item.value} value={item.value}>{item.name}</option>
                ))}
            </select>

            <textarea value={enchantmentValue} readOnly={true}></textarea>
            <button className="copyButton" onClick={copyToClipboard}>copy</button>

            <button className="copyButton">coucou toi</button>

            <ButtonsJavaEdition taille="1" title="Retour" path="goback"/>
        </div>
    )
}

export default GiveCommand