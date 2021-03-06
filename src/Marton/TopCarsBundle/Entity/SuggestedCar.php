<?php
/**
 * Created by PhpStorm.
 * User: Marci
 * Date: 03/11/14
 * Time: 20:32
 */

namespace Marton\TopCarsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="Marton\TopCarsBundle\Repository\SuggestedCarRepository")
 * @ORM\Table(name="tbl_car_suggest")
 * @ORM\HasLifecycleCallbacks()
 */
class SuggestedCar implements JsonSerializable{

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(min="2", minMessage="The model name must be at least 2 characters long",
     *                max="100", maxMessage="The model name must be at most 100 characters long")
     */
    protected $model;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $image = "default.png";

    /**
     *
     * @var File
     *
     * @Assert\File(
     *     maxSize = "1M",
     *     maxSizeMessage = "The maximum allowed file size is 1MB.",
     *     mimeTypes = {"image/jpeg", "image/png"},
     *     mimeTypesMessage = "The format of your image has to be either JPEG or PNG"
     * )
     */
    protected $imageFile;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Type(type="numeric", message="The value for Speed has to be a positive number")
     * @Assert\GreaterThan(value="-1", message="The value for Speed should be a positive number")
     * @Assert\LessThan(value="10000", message="The value for Speed is too large")
     */
    protected $speed = 0;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Type(type="numeric", message="The value for Power has to be a positive number")
     * @Assert\GreaterThan(value="-1", message="The value for Power should be a positive number")
     * @Assert\LessThan(value="100000", message="The value for Power is too large")
     */
    protected $power = 0;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Type(type="numeric", message="The value for Torque has to be a positive number")
     * @Assert\GreaterThan(value="-1", message="The value for Torque should be a positive number")
     * @Assert\LessThan(value="100000", message="The value for Torque is too large")
     */
    protected $torque = 0;

    /**
     * @ORM\Column(type="float")
     * @Assert\Type(type="numeric", message="The value for Acceleration has to be a positive number")
     * @Assert\GreaterThanOrEqual(value="0", message="The value for Acceleration should be a positive number")
     * @Assert\LessThan(value="10000", message="The value for Acceleration is too large")
     */
    protected $acceleration = 0;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Type(type="numeric", message="The value for Weight has to be a positive number")
     * @Assert\GreaterThan(value="-1", message="The value for Weight should be a positive number")
     * @Assert\LessThan(value="100000", message="The value for Weight is too large")
     */
    protected $weight = 0;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(max="255", maxMessage="Your comment must be at most 255 characters long")
     */
    protected $comment = "Please add this car!";

    /**
     * @ORM\Column(type="datetime")
     */
    protected $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="suggestedCars")
     *
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="User", mappedBy="votedSuggestedCars")
     *
     */
    private $upVotedUsers;

    public function __construct()
    {
        $this->upVotedUsers = new ArrayCollection();
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setAcceleration($acceleration)
    {
        $this->acceleration = $acceleration;
    }

    public function getAcceleration()
    {
        return $this->acceleration;
    }

    public function setComment($comment)
    {
        $this->comment = $comment;
    }

    public function getComment()
    {
        return $this->comment;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function setImageFile($imageFile)
    {
        $this->imageFile = $imageFile;
    }

    public function getImageFile()
    {
        return $this->imageFile;
    }

    public function setModel($model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return $this->model;
    }

    public function setPower($power)
    {
        $this->power = $power;
    }

    public function getPower()
    {
        return $this->power;
    }

    public function setSpeed($speed)
    {
        $this->speed = $speed;
    }

    public function getSpeed()
    {
        return $this->speed;
    }

    public function setTorque($torque)
    {
        $this->torque = $torque;
    }

    public function getTorque()
    {
        return $this->torque;
    }

    public function setWeight($weight)
    {
        $this->weight = $weight;
    }

    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload()
    {
        $this->createdAt = new \DateTime();
    }

    /**
     * Called before entity removal
     *
     * @ORM\PreRemove()
     */
    public function removeUpload()
    {

    }

    /**
     * Called after entity persistence
     *
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload()
    {

        // Clean up the file property as we won't need it anymore
        $this->imageFile = null;
    }

    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }

    /**
     * Add users
     *
     * @param \Marton\TopCarsBundle\Entity\User $user
     * @return SuggestedCar
     */
    public function addUpVotedUsers(\Marton\TopCarsBundle\Entity\User $user)
    {
        $this->upVotedUsers[] = $user;

        return $this;
    }

    public function getUpVotedUsers()
    {
        return $this->upVotedUsers->toArray();
    }

    public function jsonSerialize()
    {
        return array(
            'id' => $this->id,
            'model'=> $this->model,
            'image' => $this->image,
            'speed' => $this->speed,
            'power' => $this->power,
            'torque' => $this->torque,
            'acceleration' => $this->acceleration,
            'weight' => $this->weight,
            'comment' => $this->comment
        );
    }
} 